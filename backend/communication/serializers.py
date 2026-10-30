from rest_framework import serializers
from .models import Conversation, Message

class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.ReadOnlyField(source='sender.email')
    sender_username = serializers.ReadOnlyField(source='sender.username')

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'sender_email', 'sender_username', 'body', 'attachment_url', 'is_read', 'timestamp']
        read_only_fields = ['conversation', 'sender', 'timestamp']

class ConversationSerializer(serializers.ModelSerializer):
    customer_email = serializers.ReadOnlyField(source='customer.email')
    customer_username = serializers.ReadOnlyField(source='customer.username')
    creator_email = serializers.ReadOnlyField(source='creator.email')
    creator_username = serializers.ReadOnlyField(source='creator.username')
    requirement_title = serializers.ReadOnlyField(source='requirement.title')
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'id', 'customer', 'customer_email', 'customer_username',
            'creator', 'creator_email', 'creator_username',
            'requirement', 'requirement_title', 'created_at', 'updated_at',
            'last_message', 'unread_count'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_last_message(self, obj):
        msg = obj.messages.last()
        return MessageSerializer(msg).data if msg else None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0