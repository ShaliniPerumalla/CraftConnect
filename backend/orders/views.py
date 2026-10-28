from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .models import Order
from .serializers import OrderSerializer
from notifications.models import Notification


class OrderListCreateView(generics.ListCreateAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "CUSTOMER":
            return Order.objects.filter(
                customer=user
            ).order_by("-created_at")

        if user.role == "CREATOR":
            return Order.objects.filter(
                creator=user
            ).order_by("-created_at")

        if user.role == "ADMIN":
            return Order.objects.all().order_by("-created_at")

        return Order.objects.none()

    def perform_create(self, serializer):

        if self.request.user.role != "CUSTOMER":
            raise PermissionDenied(
                "Only customers can create orders."
            )

        quotation = serializer.validated_data["quotation"]

        if quotation.status != "APPROVED":
            raise PermissionDenied(
                "An order can only be created from an approved quotation."
            )

        if hasattr(quotation, "order"):
            raise PermissionDenied(
                "An order already exists for this quotation."
            )

        order = serializer.save(
            customer=quotation.requirement.customer,
            creator=quotation.creator,
            status="CONFIRMED",
        )

        Notification.objects.create(
            recipient=order.creator,
            notification_type="ORDER",
            title="New Order Created",
            message=(
                f"A new order has been created for "
                f"'{quotation.requirement.title}'."
            ),
        )


class OrderDetailView(generics.RetrieveUpdateAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "CUSTOMER":
            return Order.objects.filter(
                customer=user
            )

        if user.role == "CREATOR":
            return Order.objects.filter(
                creator=user
            )

        if user.role == "ADMIN":
            return Order.objects.all()

        return Order.objects.none()

    def perform_update(self, serializer):

        order = self.get_object()

        if self.request.user.role not in ["CREATOR", "ADMIN"]:
            raise PermissionDenied(
                "Only creators or administrators can update order status."
            )

        new_status = self.request.data.get("status")

        allowed_statuses = [
            "IN_PRODUCTION",
            "READY",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED",
        ]

        if new_status not in allowed_statuses:
            raise PermissionDenied(
                "Invalid order status."
            )

        serializer.save(status=new_status)

        Notification.objects.create(
            recipient=order.customer,
            notification_type="ORDER",
            title="Order Status Updated",
            message=(
                f"Your order for '{order.quotation.requirement.title}' "
                f"is now {new_status.replace('_', ' ').title()}."
            ),
        )