from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Complaint, Notification, Order, OrderStatusHistory, Review

User = get_user_model()


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusHistory
        fields = ['id', 'status', 'updated_by', 'notes', 'timestamp']


class OrderSerializer(serializers.ModelSerializer):
    buyer = serializers.PrimaryKeyRelatedField(read_only=True)
    artisan = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    quotation = serializers.PrimaryKeyRelatedField(read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'buyer', 'artisan', 'quotation', 'total_amount', 'status',
            'shipping_address', 'tracking_number', 'created_at', 'updated_at', 'status_history'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'status_history']

    def validate(self, data):
        request = self.context.get('request')
        buyer = request.user if request else None
        artisan = data.get('artisan')
        if buyer and artisan and artisan == buyer:
            raise serializers.ValidationError({'artisan': 'An order cannot be created for the same user as buyer and artisan.'})
        return data


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']

    def validate_status(self, value):
        allowed = {'accepted', 'shipped', 'delivered', 'cancelled'}
        if value not in allowed:
            raise serializers.ValidationError('Only accepted, shipped, delivered, and cancelled are allowed for status updates.')
        return value


class ReviewSerializer(serializers.ModelSerializer):
    reviewer = serializers.PrimaryKeyRelatedField(read_only=True)
    artisan = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'order', 'reviewer', 'artisan', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'reviewer', 'artisan', 'created_at']

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'title', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'recipient', 'created_at']


class ComplaintSerializer(serializers.ModelSerializer):
    complainant = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Complaint
        fields = ['id', 'order', 'complainant', 'subject', 'description', 'status', 'admin_response', 'created_at']
        read_only_fields = ['id', 'complainant', 'status', 'admin_response', 'created_at']


class ComplaintResolveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ['status', 'admin_response']

    def validate_status(self, value):
        allowed = {'resolved', 'rejected'}
        if value not in allowed:
            raise serializers.ValidationError('Complaint status must be resolved or rejected.')
        return value


class UserManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'date_joined']


class AdminPlatformStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_orders = serializers.IntegerField()
    total_complaints = serializers.IntegerField()
    open_complaints = serializers.IntegerField()
    total_reviews = serializers.IntegerField()