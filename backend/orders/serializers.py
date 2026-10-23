from rest_framework import serializers

from .models import Order


class OrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = [
            "id",
            "quotation",
            "customer",
            "creator",
            "status",
            "delivery_address",
            "expected_delivery_date",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "customer",
            "creator",
            "status",
            "created_at",
            "updated_at",
        ]