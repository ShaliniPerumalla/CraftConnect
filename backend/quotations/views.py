from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .models import Quotation
from .serializers import QuotationSerializer
from notifications.models import Notification


class QuotationListCreateView(generics.ListCreateAPIView):

    serializer_class = QuotationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "CUSTOMER":
            return Quotation.objects.filter(
                requirement__customer=user
            ).order_by("-created_at")

        if user.role == "CREATOR":
            return Quotation.objects.filter(
                creator=user
            ).order_by("-created_at")

        if user.role == "ADMIN":
            return Quotation.objects.all().order_by("-created_at")

        return Quotation.objects.none()

    def perform_create(self, serializer):

        if self.request.user.role != "CREATOR":
            raise PermissionDenied(
                "Only creators can submit quotations."
            )

        requirement = serializer.validated_data["requirement"]

        if requirement.status != "OPEN":
            raise PermissionDenied(
                "Quotations can only be submitted for open requirements."
            )

        if requirement.customer == self.request.user:
            raise PermissionDenied(
                "You cannot submit a quotation for your own requirement."
            )

        quotation = serializer.save(
            creator=self.request.user
        )

        Notification.objects.create(
            recipient=requirement.customer,
            notification_type="QUOTATION",
            title="New Quotation Received",
            message=(
                f"{self.request.user.name} submitted a quotation "
                f"for your requirement '{requirement.title}'."
            ),
        )


class QuotationDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = QuotationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "CUSTOMER":
            return Quotation.objects.filter(
                requirement__customer=user
            )

        if user.role == "CREATOR":
            return Quotation.objects.filter(
                creator=user
            )

        if user.role == "ADMIN":
            return Quotation.objects.all()

        return Quotation.objects.none()

    def perform_update(self, serializer):

        quotation = self.get_object()

        if self.request.user.role != "CUSTOMER":
            raise PermissionDenied(
                "Only customers can approve or reject quotations."
            )

        if quotation.status != "PENDING":
            raise PermissionDenied(
                "Only pending quotations can be updated."
            )

        new_status = self.request.data.get("status")

        if new_status not in ["APPROVED", "REJECTED"]:
            raise PermissionDenied(
                "Status must be APPROVED or REJECTED."
            )

        serializer.save(status=new_status)

        if new_status == "APPROVED":

            requirement = quotation.requirement
            requirement.status = "APPROVED"
            requirement.save()

            Notification.objects.create(
                recipient=quotation.creator,
                notification_type="QUOTATION",
                title="Quotation Approved",
                message=(
                    f"Your quotation for '{requirement.title}' "
                    f"has been approved by the customer."
                ),
            )

        elif new_status == "REJECTED":

            Notification.objects.create(
                recipient=quotation.creator,
                notification_type="QUOTATION",
                title="Quotation Rejected",
                message=(
                    f"Your quotation for '{quotation.requirement.title}' "
                    f"has been rejected by the customer."
                ),
            )

    def perform_destroy(self, instance):

        if self.request.user.role != "CREATOR":
            raise PermissionDenied(
                "Only creators can withdraw quotations."
            )

        if instance.status != "PENDING":
            raise PermissionDenied(
                "Only pending quotations can be withdrawn."
            )

        instance.status = "WITHDRAWN"
        instance.save()