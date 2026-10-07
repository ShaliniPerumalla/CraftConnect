from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

class ConversationListCreateView(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(Q(customer=user) | Q(creator=user))

    def create(self, request, *args, **kwargs):
        customer_id = request.data.get('customer') or request.user.id
        creator_id = request.data.get('creator')
        requirement_id = request.data.get('requirement')

        conversation, created = Conversation.objects.get_or_create(
            customer_id=customer_id,
            creator_id=creator_id,
            requirement_id=requirement_id
        )
        return Response(
            ConversationSerializer(conversation).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conv_id = self.kwargs['conversation_id']
        conversation = Conversation.objects.get(id=conv_id)
        if self.request.user not in [conversation.customer, conversation.creator]:
            return Message.objects.none()
        return Message.objects.filter(conversation_id=conv_id)

    def perform_create(self, serializer):
        conv_id = self.kwargs['conversation_id']
        conversation = Conversation.objects.get(id=conv_id)
        serializer.save(conversation=conversation, sender=self.request.user)
        conversation.save()

class MarkMessagesReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, conversation_id):
        Message.objects.filter(
            conversation_id=conversation_id
        ).exclude(sender=request.user).update(is_read=True)
        return Response({"status": "Messages marked as read."}, status=status.HTTP_200_OK)
