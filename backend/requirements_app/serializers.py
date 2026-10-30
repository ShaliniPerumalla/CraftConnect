from rest_framework import serializers
from .models import Requirement

class RequirementSerializer(serializers.ModelSerializer):
    customer_email = serializers.ReadOnlyField(source='customer.email')
    customer_username = serializers.ReadOnlyField(source='customer.username')
    quotations_count = serializers.IntegerField(source='quotations.count', read_only=True)

    class Meta:
        model = Requirement
        fields = [
            'id', 'customer', 'customer_email', 'customer_username', 'title', 'description',
            'category', 'budget', 'quantity', 'deadline',
            'delivery_address', 'reference_image', 'status', 'quotations_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['customer', 'status', 'created_at', 'updated_at']