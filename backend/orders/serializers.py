from rest_framework import serializers
from .models import Order, OrderItem, OrderStatusHistory
from django.contrib.auth import get_user_model

User = get_user_model()

class OrderUserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name']

    def get_name(self, obj):
        name = f"{obj.first_name} {obj.last_name}".strip()
        return name or obj.username

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'title', 'description', 'quantity', 'price', 'image_url']

class OrderStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.SerializerMethodField()

    class Meta:
        model = OrderStatusHistory
        fields = ['id', 'from_status', 'to_status', 'changed_by', 'changed_by_name', 'notes', 'created_at']

    def get_changed_by_name(self, obj):
        if obj.changed_by:
            name = f"{obj.changed_by.first_name} {obj.changed_by.last_name}".strip()
            return name or obj.changed_by.username
        return "System"

class OrderSerializer(serializers.ModelSerializer):
    customer = OrderUserSerializer(read_only=True)
    creator = OrderUserSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)
    review = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'customer',
            'creator',
            'quotation',
            'requirement',
            'status',
            'total_amount',
            'delivery_fee',
            'payment_status',
            'shipping_name',
            'shipping_phone',
            'shipping_address',
            'shipping_city',
            'shipping_state',
            'shipping_pincode',
            'estimated_delivery_date',
            'courier_name',
            'tracking_number',
            'design_file_url',
            'design_notes',
            'design_uploaded_at',
            'design_status',
            'customer_design_feedback',
            'production_notes',
            'cancellation_reason',
            'cancelled_at',
            'cancelled_by',
            'created_at',
            'updated_at',
            'completed_at',
            'items',
            'status_history',
            'review',
        ]
        read_only_fields = [
            'id',
            'order_number',
            'customer',
            'creator',
            'created_at',
            'updated_at',
            'completed_at',
            'items',
            'status_history',
            'review',
        ]

    def get_review(self, obj):
        if hasattr(obj, 'review'):
            return {
                'id': obj.review.id,
                'rating': obj.review.rating,
                'comment': obj.review.comment,
                'created_at': obj.review.created_at,
            }
        return None
