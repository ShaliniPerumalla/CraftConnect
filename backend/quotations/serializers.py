from rest_framework import serializers

from .models import Quotation


class QuotationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Quotation
        fields = [
            "id",
            "requirement",
            "creator",
            "price",
            "estimated_days",
            "message",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "creator",
            "status",
            "created_at",
            "updated_at",
        ]