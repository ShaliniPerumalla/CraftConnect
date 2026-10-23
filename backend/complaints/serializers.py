from rest_framework import serializers

from .models import Complaint


class ComplaintSerializer(serializers.ModelSerializer):

    class Meta:
        model = Complaint
        fields = [
            "id",
            "complainant",
            "order",
            "subject",
            "description",
            "status",
            "admin_response",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "complainant",
            "status",
            "admin_response",
            "created_at",
            "updated_at",
        ]