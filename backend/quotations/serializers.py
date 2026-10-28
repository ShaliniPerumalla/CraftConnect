from decimal import Decimal
from rest_framework import serializers
from .models import Quotation

class QuotationSerializer(serializers.ModelSerializer):
    creator_email = serializers.ReadOnlyField(source='creator.email')
    creator_name = serializers.ReadOnlyField(source='creator.username')
    requirement_title = serializers.ReadOnlyField(source='requirement.title')
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Quotation
        fields = [
            'id', 'requirement', 'requirement_title', 'creator', 'creator_email', 'creator_name',
            'price', 'delivery_charge', 'total_amount', 'description',
            'estimated_delivery_date', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['creator', 'status', 'created_at', 'updated_at']

    def get_total_amount(self, obj):
        price = Decimal(str(obj.price or 0))
        delivery = Decimal(str(obj.delivery_charge or 0))
        return price + delivery
