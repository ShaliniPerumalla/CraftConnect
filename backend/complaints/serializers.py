from rest_framework import serializers
from .models import Complaint
from orders.serializers import OrderUserSerializer

class ComplaintSerializer(serializers.ModelSerializer):
    user = OrderUserSerializer(read_only=True)
    resolved_by = OrderUserSerializer(read_only=True)
    order_number = serializers.ReadOnlyField(source='order.order_number')

    class Meta:
        model = Complaint
        fields = [
            'id',
            'ticket_id',
            'user',
            'order',
            'order_number',
            'subject',
            'description',
            'category',
            'priority',
            'status',
            'admin_notes',
            'resolution_notes',
            'resolved_by',
            'created_at',
            'updated_at',
            'resolved_at',
        ]
        read_only_fields = [
            'id',
            'ticket_id',
            'user',
            'resolved_by',
            'created_at',
            'updated_at',
            'resolved_at',
            'order_number',
        ]
