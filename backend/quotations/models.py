from django.conf import settings
from django.db import models


class Quotation(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
        ("WITHDRAWN", "Withdrawn"),
    ]

    requirement = models.ForeignKey(
        "requirements_app.Requirement",
        on_delete=models.CASCADE,
        related_name="quotations",
    )

    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="quotations",
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    estimated_days = models.PositiveIntegerField()

    message = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING",
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"Quotation #{self.id} - {self.requirement.title}"