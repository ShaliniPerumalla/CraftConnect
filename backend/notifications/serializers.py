from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    recipient_email = serializers.ReadOnlyField(source='recipient.email')

    class Meta:
        model = Notification
        fields = [
            'id',
            'recipient',
            'recipient_email',
            'notification_type',
            'title',
            'message',
            'link',
            'is_read',
            'created_at',
        ]
        read_only_fields = ['id', 'recipient', 'created_at']
