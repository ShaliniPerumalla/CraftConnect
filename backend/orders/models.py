from django.conf import settings
from django.db import models


class Order(models.Model):

    STATUS_CHOICES = [
        ("CONFIRMED", "Confirmed"),
        ("IN_PRODUCTION", "In Production"),
        ("READY", "Ready"),
        ("OUT_FOR_DELIVERY", "Out for Delivery"),
        ("DELIVERED", "Delivered"),
        ("CANCELLED", "Cancelled"),
    ]

    quotation = models.OneToOneField(
        "quotations.Quotation",
        on_delete=models.CASCADE,
        related_name="order",
    )

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="customer_orders",
    )

    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="creator_orders",
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="CONFIRMED",
    )

    delivery_address = models.TextField()

    expected_delivery_date = models.DateField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"Order #{self.id} - {self.quotation.requirement.title}"