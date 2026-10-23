from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .models import Complaint
from .serializers import ComplaintSerializer
from notifications.models import Notification


class ComplaintListCreateView(generics.ListCreateAPIView):

    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role in ["CUSTOMER", "CREATOR"]:
            return Complaint.objects.filter(
                complainant=user
            ).order_by("-created_at")

        if user.role == "ADMIN":
            return Complaint.objects.all().order_by("-created_at")

        return Complaint.objects.none()

    def perform_create(self, serializer):

        if self.request.user.role not in ["CUSTOMER", "CREATOR"]:
            raise PermissionDenied(
                "Only customers and creators can submit complaints."
            )

        order = serializer.validated_data["order"]

        if (
            order.customer != self.request.user
            and order.creator != self.request.user
        ):
            raise PermissionDenied(
                "You can only complain about your own orders."
            )

        complaint = serializer.save(
            complainant=self.request.user
        )

        admin_users = self.request.user.__class__.objects.filter(
            role="ADMIN",
            is_active=True,
        )

        for admin in admin_users:
            Notification.objects.create(
                recipient=admin,
                notification_type="SYSTEM",
                title="New Complaint Submitted",
                message=(
                    f"{self.request.user.name} submitted a complaint "
                    f"about order #{order.id}: {complaint.subject}."
                ),
            )


class ComplaintDetailView(generics.RetrieveUpdateAPIView):

    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "ADMIN":
            return Complaint.objects.all()

        return Complaint.objects.filter(
            complainant=user
        )

    def perform_update(self, serializer):

        if self.request.user.role != "ADMIN":
            raise PermissionDenied(
                "Only administrators can update complaints."
            )

        new_status = self.request.data.get("status")
        admin_response = self.request.data.get("admin_response")

        allowed_statuses = [
            "IN_REVIEW",
            "RESOLVED",
            "REJECTED",
        ]

        if new_status not in allowed_statuses:
            raise PermissionDenied(
                "Invalid complaint status."
            )

        serializer.save(
            status=new_status,
            admin_response=admin_response or "",
        )