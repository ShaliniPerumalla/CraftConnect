from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .models import Message
from .serializers import MessageSerializer
from notifications.models import Notification


class MessageListCreateView(generics.ListCreateAPIView):

    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return (
            Message.objects.filter(sender=user)
            | Message.objects.filter(receiver=user)
        ).order_by("-created_at")

    def perform_create(self, serializer):

        receiver = serializer.validated_data["receiver"]

        if receiver == self.request.user:
            raise PermissionDenied(
                "You cannot send a message to yourself."
            )

        if receiver.role not in ["CUSTOMER", "CREATOR"]:
            raise PermissionDenied(
                "Messages can only be sent between customers and creators."
            )

        message = serializer.save(
            sender=self.request.user
        )

        Notification.objects.create(
            recipient=receiver,
            notification_type="MESSAGE",
            title="New Message",
            message=(
                f"You received a new message from "
                f"{self.request.user.name}."
            ),
        )