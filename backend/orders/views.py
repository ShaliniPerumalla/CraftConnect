from django.utils import timezone
from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, PermissionDenied

from .models import Order, OrderItem, OrderStatusHistory
from .serializers import OrderSerializer, OrderItemSerializer
from notifications.services import create_notification
from django.contrib.auth import get_user_model

User = get_user_model()

def is_admin_user(user):
    return user.is_staff or user.is_superuser or str(getattr(user, 'role', '')).lower() == 'admin'

class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role_param = (self.request.query_params.get('role') or '').lower()
        status_param = self.request.query_params.get('status')

        if is_admin_user(user) and not role_param:
            qs = Order.objects.all()
        elif role_param == 'creator' or str(getattr(user, 'role', '')).lower() == 'creator':
            qs = Order.objects.filter(creator=user)
        elif role_param == 'customer' or str(getattr(user, 'role', '')).lower() == 'customer':
            qs = Order.objects.filter(customer=user)
        else:
            qs = Order.objects.filter(Q(customer=user) | Q(creator=user))

        if status_param and status_param != 'All':
            qs = qs.filter(status__iexact=status_param)

        return qs.select_related('customer', 'creator', 'quotation', 'requirement').prefetch_related('items', 'status_history')

    def perform_create(self, serializer):
        user = self.request.user
        creator_id = self.request.data.get('creator_id') or self.request.data.get('creator')
        quotation_id = self.request.data.get('quotation_id') or self.request.data.get('quotation')
        requirement_id = self.request.data.get('requirement_id') or self.request.data.get('requirement')

        creator = None
        if creator_id:
            try:
                creator = User.objects.get(id=creator_id)
            except User.DoesNotExist:
                pass

        if not creator and quotation_id:
            from quotations.models import Quotation
            try:
                quote = Quotation.objects.get(id=quotation_id)
                creator = quote.creator
            except Quotation.DoesNotExist:
                pass

        if not creator:
            creator = User.objects.filter(username='artisan_demo').first() or user

        total_amount = self.request.data.get('total_amount') or self.request.data.get('total') or 0.00
        delivery_fee = self.request.data.get('delivery_fee') or 0.00
        initial_status = self.request.data.get('status') or 'pending'

        order = serializer.save(
            customer=user,
            creator=creator,
            total_amount=total_amount,
            delivery_fee=delivery_fee,
            status=initial_status
        )

        # Create order items if provided
        items_data = self.request.data.get('items', [])
        if isinstance(items_data, list):
            for item in items_data:
                OrderItem.objects.create(
                    order=order,
                    title=item.get('name') or item.get('title') or 'Handmade Craft',
                    description=item.get('description', ''),
                    quantity=item.get('quantity', 1),
                    price=item.get('price', total_amount),
                    image_url=item.get('image') or item.get('image_url') or ''
                )

        # Record initial status history
        OrderStatusHistory.objects.create(
            order=order,
            from_status='None',
            to_status=order.status,
            changed_by=user,
            notes='Order created'
        )

        # Notify creator
        create_notification(
            recipient=creator,
            notification_type='order_created',
            title='New Order Placed',
            message=f"Order {order.order_number} has been created for you by {user.username}.",
            link=f"/creator/orders"
        )
        # Notify customer
        create_notification(
            recipient=user,
            notification_type='order_created',
            title='Order Confirmed',
            message=f"Your order {order.order_number} has been placed successfully.",
            link=f"/orders/{order.id}"
        )


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        pk = self.kwargs.get('pk')
        user = self.request.user
        try:
            if str(pk).isdigit():
                order = Order.objects.get(id=pk)
            else:
                order = Order.objects.get(order_number=pk)
        except Order.DoesNotExist:
            raise ValidationError({"error": "Order not found."})

        if not (is_admin_user(user) or order.customer == user or order.creator == user):
            raise PermissionDenied("You do not have permission to view this order.")

        return order


class OrderStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        user = request.user
        try:
            order = Order.objects.get(pk=pk) if str(pk).isdigit() else Order.objects.get(order_number=pk)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        is_admin = is_admin_user(user)
        is_creator = (order.creator == user)
        is_customer = (order.customer == user)

        if not (is_admin or is_creator or is_customer):
            return Response({"error": "Not authorized to update this order."}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get('status')
        notes = request.data.get('notes', '')
        tracking_number = request.data.get('tracking_number')
        courier_name = request.data.get('courier_name')
        production_notes = request.data.get('production_notes')

        if not new_status:
            return Response({"error": "New status is required."}, status=status.HTTP_400_BAD_REQUEST)

        new_status = new_status.lower()

        # Enforce transition rules unless super admin
        if not is_admin and not order.can_transition_to(new_status):
            return Response({
                "error": f"Invalid transition from '{order.status}' to '{new_status}'. Allowed transitions: {Order.get_valid_transitions().get(order.status, [])}"
            }, status=status.HTTP_400_BAD_REQUEST)

        # Role-based permitted statuses
        if not is_admin:
            if is_creator and new_status in ['cancelled'] and order.status not in ['pending', 'design']:
                return Response({"error": "Creator cannot cancel order once production has begun."}, status=status.HTTP_400_BAD_REQUEST)
            if is_customer and new_status not in ['delivered', 'cancelled']:
                return Response({"error": "Customers can only confirm delivery or cancel eligible orders."}, status=status.HTTP_403_FORBIDDEN)

        old_status = order.status
        order.status = new_status

        if tracking_number:
            order.tracking_number = tracking_number
        if courier_name:
            order.courier_name = courier_name
        if production_notes:
            order.production_notes = production_notes

        if new_status == 'delivered':
            order.completed_at = timezone.now()

        order.save()

        # Log history
        OrderStatusHistory.objects.create(
            order=order,
            from_status=old_status,
            to_status=new_status,
            changed_by=user,
            notes=notes or f"Status changed to {new_status}"
        )

        # Notify relevant party
        target_user = order.customer if user == order.creator else order.creator
        create_notification(
            recipient=target_user,
            notification_type='order_status',
            title=f"Order Status: {new_status.replace('_', ' ').title()}",
            message=f"Order {order.order_number} has been updated to {new_status.replace('_', ' ').title()}.",
            link=f"/orders/{order.id}"
        )

        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)


class OrderDesignUploadView(APIView):
    """Creator uploads custom design preview / proof for customer review."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        try:
            order = Order.objects.get(pk=pk) if str(pk).isdigit() else Order.objects.get(order_number=pk)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        if not (is_admin_user(user) or order.creator == user):
            return Response({"error": "Only the assigned creator can upload designs."}, status=status.HTTP_403_FORBIDDEN)

        if order.status in ['delivered', 'cancelled']:
            return Response({"error": "Cannot upload design for completed or cancelled orders."}, status=status.HTTP_400_BAD_REQUEST)

        design_file_url = request.data.get('design_file_url') or request.data.get('design_url') or request.data.get('image')
        design_notes = request.data.get('design_notes', '')

        if not design_file_url:
            return Response({"error": "Design file URL is required."}, status=status.HTTP_400_BAD_REQUEST)

        old_status = order.status
        order.design_file_url = design_file_url
        order.design_notes = design_notes
        order.design_uploaded_at = timezone.now()
        order.design_status = 'submitted'
        order.status = 'design_review'
        order.save()

        OrderStatusHistory.objects.create(
            order=order,
            from_status=old_status,
            to_status='design_review',
            changed_by=user,
            notes=f"Design uploaded: {design_notes}"
        )

        # Notify customer
        create_notification(
            recipient=order.customer,
            notification_type='design_uploaded',
            title='New Design Uploaded for Review',
            message=f"The creator has uploaded a design mockup for Order {order.order_number}. Please review and approve.",
            link=f"/orders/{order.id}"
        )

        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)


class OrderDesignReviewView(APIView):
    """Customer approves design or requests changes."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        try:
            order = Order.objects.get(pk=pk) if str(pk).isdigit() else Order.objects.get(order_number=pk)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        if not (is_admin_user(user) or order.customer == user):
            return Response({"error": "Only the customer can review this design."}, status=status.HTTP_403_FORBIDDEN)

        action = request.data.get('action') # 'approve' or 'revision'
        feedback = request.data.get('feedback', '')

        if action not in ['approve', 'revision']:
            return Response({"error": "Action must be 'approve' or 'revision'."}, status=status.HTTP_400_BAD_REQUEST)

        old_status = order.status
        order.customer_design_feedback = feedback

        if action == 'approve':
            order.design_status = 'approved'
            order.status = 'production'
            note = f"Design approved by customer. Feedback: {feedback}"
            notif_type = 'design_approved'
            notif_title = 'Design Approved by Customer'
            notif_msg = f"Customer has approved the design for Order {order.order_number}! You may now proceed to production."
        else:
            order.design_status = 'revision_requested'
            order.status = 'design'
            note = f"Revision requested by customer: {feedback}"
            notif_type = 'design_rejected'
            notif_title = 'Design Revision Requested'
            notif_msg = f"Customer requested changes on Order {order.order_number}: {feedback}"

        order.save()

        OrderStatusHistory.objects.create(
            order=order,
            from_status=old_status,
            to_status=order.status,
            changed_by=user,
            notes=note
        )

        create_notification(
            recipient=order.creator,
            notification_type=notif_type,
            title=notif_title,
            message=notif_msg,
            link=f"/creator/orders"
        )

        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)


class OrderCancelView(APIView):
    """Customer or Creator cancels an eligible order."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        try:
            order = Order.objects.get(pk=pk) if str(pk).isdigit() else Order.objects.get(order_number=pk)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        is_admin = is_admin_user(user)
        if not (is_admin or order.customer == user or order.creator == user):
            return Response({"error": "Not authorized to cancel this order."}, status=status.HTTP_403_FORBIDDEN)

        # Enforce cancellation rules
        if not is_admin and order.status not in ['pending', 'design', 'design_review']:
            return Response({
                "error": f"Cannot cancel order in '{order.status}' stage. Cancellation is only permitted before production starts."
            }, status=status.HTTP_400_BAD_REQUEST)

        reason = request.data.get('reason', 'Cancelled by user')
        old_status = order.status
        order.status = 'cancelled'
        order.cancellation_reason = reason
        order.cancelled_at = timezone.now()
        order.cancelled_by = user
        order.save()

        OrderStatusHistory.objects.create(
            order=order,
            from_status=old_status,
            to_status='cancelled',
            changed_by=user,
            notes=f"Order cancelled: {reason}"
        )

        target = order.creator if user == order.customer else order.customer
        create_notification(
            recipient=target,
            notification_type='order_status',
            title='Order Cancelled',
            message=f"Order {order.order_number} was cancelled. Reason: {reason}",
            link=f"/orders/{order.id}"
        )

        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)
