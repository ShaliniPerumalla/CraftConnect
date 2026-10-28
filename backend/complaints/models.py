from django.conf import settings
from django.db import models


class Complaint(models.Model):

    STATUS_CHOICES = [
        ("OPEN", "Open"),
        ("IN_REVIEW", "In Review"),
        ("RESOLVED", "Resolved"),
        ("REJECTED", "Rejected"),
    ]

    complainant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="complaints",
    )

    order = models.ForeignKey(
        "orders.Order",
        on_delete=models.CASCADE,
        related_name="complaints",
    )

    subject = models.CharField(
        max_length=200
    )

    description = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="OPEN",
    )

    admin_response = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"Complaint #{self.id} - {self.subject}"