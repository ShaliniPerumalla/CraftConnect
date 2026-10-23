from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .models import Review
from .serializers import ReviewSerializer
from notifications.models import Notification


class ReviewListCreateView(generics.ListCreateAPIView):

    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "CUSTOMER":
            return Review.objects.filter(
                reviewer=user
            ).order_by("-created_at")

        if user.role == "CREATOR":
            return Review.objects.filter(
                creator=user
            ).order_by("-created_at")

        if user.role == "ADMIN":
            return Review.objects.all().order_by("-created_at")

        return Review.objects.none()

    def perform_create(self, serializer):

        if self.request.user.role != "CUSTOMER":
            raise PermissionDenied(
                "Only customers can submit reviews."
            )

        order = serializer.validated_data["order"]

        if order.customer != self.request.user:
            raise PermissionDenied(
                "You can only review your own orders."
            )

        if order.status != "DELIVERED":
            raise PermissionDenied(
                "You can only review a delivered order."
            )

        if hasattr(order, "review"):
            raise PermissionDenied(
                "This order has already been reviewed."
            )

        review = serializer.save(
            reviewer=self.request.user,
            creator=order.creator,
        )

        Notification.objects.create(
            recipient=order.creator,
            notification_type="REVIEW",
            title="New Review Received",
            message=(
                f"You received a {review.rating}-star review "
                f"for the order '{order.quotation.requirement.title}'."
            ),
        )