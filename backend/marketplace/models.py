from django.conf import settings
from django.db import models


class CreatorProfile(models.Model):

    creator = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="creator_profile",
    )

    business_name = models.CharField(
        max_length=150,
        blank=True,
    )

    bio = models.TextField(
        blank=True,
    )

    category = models.CharField(
        max_length=100,
        blank=True,
    )

    location = models.CharField(
        max_length=200,
        blank=True,
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
    )

    profile_image = models.ImageField(
        upload_to="creator_profiles/",
        null=True,
        blank=True,
    )

    is_available = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.business_name or self.creator.name