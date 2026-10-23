from rest_framework import serializers

from .models import Requirement


class RequirementSerializer(serializers.ModelSerializer):

    class Meta:
        model = Requirement
        fields = [
            "id",
            "title",
            "description",
            "category",
            "budget",
            "deadline",
            "reference_image",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "status",
            "created_at",
            "updated_at",
        ]