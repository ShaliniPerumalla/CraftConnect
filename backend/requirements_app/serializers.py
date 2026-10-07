from rest_framework import serializers
from .models import Requirement

class RequirementSerializer(serializers.ModelSerializer):
    customer_email = serializers.ReadOnlyField(source='customer.email')

    class Meta:
        model = Requirement
        fields = [
            'id', 'customer', 'customer_email', 'title', 'description',
            'category', 'budget', 'quantity', 'deadline',
            'delivery_address', 'reference_image', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['customer', 'status', 'created_at', 'updated_at']