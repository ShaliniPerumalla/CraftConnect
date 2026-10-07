from rest_framework import serializers
from .models import Conversation, Message

class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.ReadOnlyField(source='sender.email')

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'sender_email', 'body', 'attachment_url', 'is_read', 'timestamp']
        read_only_fields = ['conversation', 'sender', 'timestamp']

class ConversationSerializer(serializers.ModelSerializer):
    customer_email = serializers.ReadOnlyField(source='customer.email')
    creator_email = serializers.ReadOnlyField(source='creator.email')
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'customer', 'customer_email', 'creator', 'creator_email', 'requirement', 'created_at', 'updated_at', 'last_message']
        read_only_fields = ['created_at', 'updated_at']

    def get_last_message(self, obj):
        msg = obj.messages.last()
        return MessageSerializer(msg).data if msg else None