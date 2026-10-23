from rest_framework import serializers
from .models import CreatorProfile


class CreatorProfileSerializer(serializers.ModelSerializer):

    creator_name = serializers.CharField(
        source="creator.name",
        read_only=True
    )

    class Meta:
        model = CreatorProfile
        fields = [
            "id",
            "creator",
            "creator_name",
            "business_name",
            "bio",
            "category",
            "location",
            "phone",
            "profile_image",
            "is_available",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "creator",
            "creator_name",
            "created_at",
            "updated_at",
        ]