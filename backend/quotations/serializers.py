from rest_framework import serializers
from .models import Quotation

class QuotationSerializer(serializers.ModelSerializer):
    creator_email = serializers.ReadOnlyField(source='creator.email')
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Quotation
        fields = [
            'id', 'requirement', 'creator', 'creator_email',
            'price', 'delivery_charge', 'total_amount', 'description',
            'estimated_delivery_date', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['creator', 'status', 'created_at', 'updated_at']

    def get_total_amount(self, obj):
        return obj.price + obj.delivery_charge