from rest_framework import serializers
from .models import Review
from orders.serializers import OrderUserSerializer

class ReviewSerializer(serializers.ModelSerializer):
    customer = OrderUserSerializer(read_only=True)
    creator = OrderUserSerializer(read_only=True)
    order_number = serializers.ReadOnlyField(source='order.order_number')

    class Meta:
        model = Review
        fields = [
            'id',
            'order',
            'order_number',
            'customer',
            'creator',
            'rating',
            'comment',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'customer', 'creator', 'created_at', 'updated_at', 'order_number']
