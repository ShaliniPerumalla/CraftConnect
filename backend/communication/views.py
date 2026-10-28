from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

class ConversationListCreateView(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(Q(customer=user) | Q(creator=user))

    def create(self, request, *args, **kwargs):
        customer_id = request.data.get('customer')
        creator_id = request.data.get('creator')
        requirement_id = request.data.get('requirement')

        if requirement_id:
            try:
                from requirements_app.models import Requirement
                req = Requirement.objects.get(id=requirement_id)
                if not customer_id:
                    customer_id = req.customer_id
            except Exception:
                pass

        # If user is not customer, default creator to request.user if not specified
        if not customer_id:
            customer_id = request.user.id
        elif not creator_id and customer_id != request.user.id:
            creator_id = request.user.id

        if not creator_id:
            return Response({"error": "Creator must be specified for the conversation."}, status=status.HTTP_400_BAD_REQUEST)

        conversation, created = Conversation.objects.get_or_create(
            customer_id=customer_id,
            creator_id=creator_id,
            requirement_id=requirement_id
        )
        return Response(
            ConversationSerializer(conversation, context={'request': request}).data,
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
