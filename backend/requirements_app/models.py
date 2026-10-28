from django.conf import settings
from django.db import models


class Requirement(models.Model):

    STATUS_CHOICES = [
        ("OPEN", "Open"),
        ("QUOTED", "Quoted"),
        ("APPROVED", "Approved"),
        ("CANCELLED", "Cancelled"),
        ("COMPLETED", "Completed"),
    ]

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="requirements",
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    category = models.CharField(max_length=100)

    budget = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    deadline = models.DateField()

    reference_image = models.ImageField(
        upload_to="requirements/",
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="OPEN",
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.title