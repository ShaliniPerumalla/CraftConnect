from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from .models import Complaint
from .serializers import ComplaintSerializer
from orders.models import Order
from notifications.services import create_notification
from orders.views import is_admin_user

class ComplaintListCreateView(generics.ListCreateAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        category = self.request.query_params.get('category')
        status_param = self.request.query_params.get('status')

        if is_admin_user(user):
            qs = Complaint.objects.all()
        else:
            qs = Complaint.objects.filter(user=user)

        if category and category != 'All':
            qs = qs.filter(category__iexact=category)
        if status_param and status_param != 'All':
            qs = qs.filter(status__iexact=status_param)

        return qs.select_related('user', 'order', 'resolved_by')

    def perform_create(self, serializer):
        user = self.request.user
        order_id = self.request.data.get('order_id') or self.request.data.get('order')
        order = None

        if order_id:
            try:
                if str(order_id).isdigit():
                    order = Order.objects.get(id=order_id)
                else:
                    order = Order.objects.get(order_number=order_id)
            except Order.DoesNotExist:
                pass

        complaint = serializer.save(user=user, order=order)

        # Notify user that complaint was filed
        create_notification(
            recipient=user,
            notification_type='complaint_update',
            title='Support Ticket Raised',
            message=f"Your ticket {complaint.ticket_id} has been submitted. Our team will review it shortly.",
            link="/complaints"
        )


class ComplaintDetailUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        pk = self.kwargs.get('pk')
        try:
            if str(pk).isdigit():
                complaint = Complaint.objects.get(id=pk)
            else:
                complaint = Complaint.objects.get(ticket_id=pk)
        except Complaint.DoesNotExist:
            raise ValidationError({"error": "Complaint ticket not found."})

        user = self.request.user
        if not (is_admin_user(user) or complaint.user == user):
            raise PermissionDenied("You do not have permission to view this complaint.")

        return complaint

    def perform_update(self, serializer):
        user = self.request.user
        complaint = self.get_object()

        # Only admin can update status / admin_notes
        if not is_admin_user(user):
            raise PermissionDenied("Only administrative staff can update complaint status.")

        new_status = self.request.data.get('status')
        if new_status and new_status != complaint.status:
            if new_status in ['Resolved', 'Closed']:
                serializer.save(
                    resolved_by=user,
                    resolved_at=timezone.now()
                )
            else:
                serializer.save()

            create_notification(
                recipient=complaint.user,
                notification_type='complaint_update',
                title=f"Complaint Status: {new_status}",
                message=f"Your ticket {complaint.ticket_id} status has been updated to '{new_status}'.",
                link="/complaints"
            )
        else:
            serializer.save()


class ComplaintResolveView(APIView):
    """Admin resolves or closes a complaint with resolution notes."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        if not is_admin_user(user):
            return Response({"error": "Admin access required."}, status=status.HTTP_403_FORBIDDEN)

        try:
            if str(pk).isdigit():
                complaint = Complaint.objects.get(id=pk)
            else:
                complaint = Complaint.objects.get(ticket_id=pk)
        except Complaint.DoesNotExist:
            return Response({"error": "Complaint not found."}, status=status.HTTP_404_NOT_FOUND)

        resolution_notes = request.data.get('resolution_notes', '').strip()
        new_status = request.data.get('status', 'Resolved')

        if new_status not in ['Resolved', 'Closed']:
            new_status = 'Resolved'

        complaint.status = new_status
        complaint.resolution_notes = resolution_notes
        complaint.resolved_by = user
        complaint.resolved_at = timezone.now()
        complaint.save()

        create_notification(
            recipient=complaint.user,
            notification_type='complaint_update',
            title=f"Complaint {new_status}",
            message=f"Ticket {complaint.ticket_id} has been marked as {new_status}. Resolution: {resolution_notes or 'Issue resolved by administration.'}",
            link="/complaints"
        )

        return Response(ComplaintSerializer(complaint).data, status=status.HTTP_200_OK)


class ComplaintStatisticsView(APIView):
    """Get counts of complaints by status."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        qs = Complaint.objects.all() if is_admin_user(user) else Complaint.objects.filter(user=user)

        total = qs.count()
        pending = qs.filter(status='Pending').count()
        in_review = qs.filter(status='In Review').count()
        resolved = qs.filter(status='Resolved').count()
        closed = qs.filter(status='Closed').count()

        return Response({
            "total": total,
            "pending": pending,
            "in_review": in_review,
            "resolved": resolved,
            "closed": closed,
        }, status=status.HTTP_200_OK)
