from django.shortcuts import render
from django.db import models
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Quotation
from .serializers import QuotationSerializer
from requirements_app.models import Requirement

class QuotationListCreateView(generics.ListCreateAPIView):
    serializer_class = QuotationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user
        req_id = self.request.query_params.get('requirement') or self.request.query_params.get('requirement_id')
        role_param = (self.request.query_params.get('role') or '').lower()
        is_creator = (
            role_param == 'creator'
            or not user.is_authenticated
            or str(getattr(user, 'role', '')).lower() == 'creator'
            or getattr(user, 'is_creator', False)
        )

        qs = Quotation.objects.all()
        if req_id:
            qs = qs.filter(requirement_id=req_id)
            if user.is_authenticated and not is_creator:
                qs = qs.filter(requirement__customer=user)
            return qs

        if not user.is_authenticated or is_creator:
            return qs.filter(creator=user) if user.is_authenticated else qs
        return qs.filter(requirement__customer=user)

    def perform_create(self, serializer):
        from django.contrib.auth import get_user_model
        from notifications.services import create_notification
        User = get_user_model()
        req = serializer.validated_data['requirement']
        if self.request.user.is_authenticated:
            creator = self.request.user
        else:
            creator = User.objects.get_or_create(
                username='artisan_demo',
                defaults={'email': 'artisan@makermatch.internal'}
            )[0]

        if req.status not in ['open', 'quoted']:
            raise ValidationError({"error": "Cannot submit bids on closed, accepted, or unavailable requirements."})

        if req.customer == creator:
            raise ValidationError({"error": "Creators cannot submit quotations to their own requirements."})

        if Quotation.objects.filter(requirement=req, creator=creator).exists():
            raise ValidationError({"error": "You have already submitted a quotation for this requirement."})

        quote = serializer.save(creator=creator)
        if req.status == 'open':
            req.status = 'quoted'
            req.save()

        # Notify requirement customer about new quotation
        create_notification(
            recipient=req.customer,
            notification_type='quotation',
            title='New Quotation Received',
            message=f"{creator.username} sent a quotation of ₹{quote.price} for '{req.title}'.",
            link="/requirements"
        )

class QuotationDetailUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuotationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Creator can manage their quotation; customer of requirement can view
        return Quotation.objects.filter(
            models.Q(creator=user) | models.Q(requirement__customer=user)
        )

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.creator != self.request.user:
            raise ValidationError({"error": "You can only update your own quotation."})
        if instance.status != 'pending':
            raise ValidationError({"error": "Cannot modify quotation once accepted or rejected."})
        serializer.save()

    def perform_destroy(self, instance):
        if instance.creator != self.request.user:
            return Response({"error": "You can only cancel your own quotation."}, status=status.HTTP_403_FORBIDDEN)
        if instance.status != 'pending':
            return Response({"error": "Cannot withdraw quotation once accepted or rejected."}, status=status.HTTP_400_BAD_REQUEST)
        instance.delete()
        return Response({"message": "Quotation withdrawn successfully."}, status=status.HTTP_200_OK)

class RequirementQuotationsListView(generics.ListAPIView):
    serializer_class = QuotationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        req_id = self.kwargs['requirement_id']
        req = Requirement.objects.get(id=req_id)
        if req.customer == self.request.user:
            return Quotation.objects.filter(requirement_id=req_id)
        return Quotation.objects.filter(requirement_id=req_id, creator=self.request.user)

class QuotationAcceptRejectView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk, action):
        from notifications.services import create_notification
        from orders.models import Order, OrderItem, OrderStatusHistory
        try:
            quotation = Quotation.objects.get(pk=pk, requirement__customer=request.user)
        except Quotation.DoesNotExist:
            return Response({"error": "Quotation not found or you are not authorized."}, status=status.HTTP_404_NOT_FOUND)

        if action == 'accept':
            quotation.status = 'accepted'
            quotation.save()
            quotation.requirement.status = 'accepted'
            quotation.requirement.save()

            # Reject all other competing quotes on this requirement
            competing = Quotation.objects.filter(requirement=quotation.requirement).exclude(id=quotation.id)
            for c in competing:
                c.status = 'rejected'
                c.save()
                create_notification(
                    recipient=c.creator,
                    notification_type='quotation_rejected',
                    title='Quotation Not Selected',
                    message=f"The customer accepted another quotation for '{quotation.requirement.title}'.",
                    link="/requirements"
                )

            # Auto-create Order from accepted quotation
            total = quotation.price + (quotation.delivery_charge or 0)
            order, created = Order.objects.get_or_create(
                quotation=quotation,
                defaults={
                    'customer': request.user,
                    'creator': quotation.creator,
                    'requirement': quotation.requirement,
                    'total_amount': total,
                    'delivery_fee': quotation.delivery_charge or 0,
                    'status': 'pending',
                    'shipping_address': quotation.requirement.delivery_address or '',
                    'shipping_name': request.user.username,
                    'estimated_delivery_date': quotation.estimated_delivery_date,
                }
            )

            if created:
                OrderItem.objects.create(
                    order=order,
                    title=quotation.requirement.title,
                    description=quotation.description,
                    quantity=quotation.requirement.quantity,
                    price=quotation.price,
                    image_url=quotation.requirement.reference_image or ''
                )
                OrderStatusHistory.objects.create(
                    order=order,
                    from_status='None',
                    to_status='pending',
                    changed_by=request.user,
                    notes='Order created from accepted quotation'
                )

            # Notify creator
            create_notification(
                recipient=quotation.creator,
                notification_type='quotation_accepted',
                title='Quotation Accepted!',
                message=f"Your quotation of ₹{quotation.price} for '{quotation.requirement.title}' was accepted! Order {order.order_number} has been created.",
                link="/creator/orders"
            )

            # Notify customer
            create_notification(
                recipient=request.user,
                notification_type='order_created',
                title='Order Created',
                message=f"Order {order.order_number} has been activated for '{quotation.requirement.title}'.",
                link=f"/orders/{order.id}"
            )

            return Response({
                "message": "Quotation accepted and order created successfully.",
                "order_id": order.id,
                "order_number": order.order_number
            }, status=status.HTTP_200_OK)

        elif action == 'reject':
            quotation.status = 'rejected'
            quotation.save()
            create_notification(
                recipient=quotation.creator,
                notification_type='quotation_rejected',
                title='Quotation Declined',
                message=f"Your quotation for '{quotation.requirement.title}' was declined.",
                link="/requirements"
            )
            return Response({"message": "Quotation rejected."}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid action parameter. Must be 'accept' or 'reject'."}, status=status.HTTP_400_BAD_REQUEST)
# Create your views here.
