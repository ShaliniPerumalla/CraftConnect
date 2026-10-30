import uuid
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from quotations.models import Quotation
from requirements_app.models import Requirement

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('design', 'Design Stage'),
        ('design_review', 'Design Review Pending'),
        ('production', 'In Production'),
        ('ready_for_delivery', 'Ready for Delivery'),
        ('shipped', 'Shipped / In Transit'),
        ('delivered', 'Delivered / Completed'),
        ('cancelled', 'Cancelled'),
    )

    DESIGN_STATUS_CHOICES = (
        ('pending', 'Pending Upload'),
        ('submitted', 'Awaiting Customer Approval'),
        ('approved', 'Approved'),
        ('revision_requested', 'Revision Requested'),
    )

    order_number = models.CharField(max_length=50, unique=True, editable=False)
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='customer_orders'
    )
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='creator_orders'
    )
    quotation = models.ForeignKey(
        Quotation,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders'
    )
    requirement = models.ForeignKey(
        Requirement,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders'
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default='pending'
    )
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_status = models.CharField(max_length=30, default='Paid')

    # Delivery & Shipping info
    shipping_name = models.CharField(max_length=150, blank=True)
    shipping_phone = models.CharField(max_length=30, blank=True)
    shipping_address = models.TextField(blank=True)
    shipping_city = models.CharField(max_length=100, blank=True)
    shipping_state = models.CharField(max_length=100, blank=True)
    shipping_pincode = models.CharField(max_length=20, blank=True)
    estimated_delivery_date = models.DateField(null=True, blank=True)
    courier_name = models.CharField(max_length=100, blank=True, default='')
    tracking_number = models.CharField(max_length=100, blank=True, default='')

    # Design & Production info
    design_file_url = models.URLField(max_length=500, blank=True, null=True)
    design_notes = models.TextField(blank=True, default='')
    design_uploaded_at = models.DateTimeField(null=True, blank=True)
    design_status = models.CharField(
        max_length=30,
        choices=DESIGN_STATUS_CHOICES,
        default='pending'
    )
    customer_design_feedback = models.TextField(blank=True, default='')
    production_notes = models.TextField(blank=True, default='')

    # Cancellation info
    cancellation_reason = models.TextField(blank=True, default='')
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancelled_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='cancelled_orders'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    @classmethod
    def get_valid_transitions(cls):
        return {
            'pending': ['design', 'production', 'cancelled'],
            'design': ['design_review', 'production', 'cancelled'],
            'design_review': ['production', 'design', 'cancelled'],
            'production': ['ready_for_delivery'],
            'ready_for_delivery': ['shipped'],
            'shipped': ['delivered'],
            'delivered': [],
            'cancelled': [],
        }

    def can_transition_to(self, new_status):
        transitions = self.get_valid_transitions()
        allowed = transitions.get(self.status, [])
        return new_status in allowed

    def __str__(self):
        return f"{self.order_number} ({self.status}) - {self.customer.email}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"{self.quantity}x {self.title} (${self.price})"


class OrderStatusHistory(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='status_history'
    )
    from_status = models.CharField(max_length=50)
    to_status = models.CharField(max_length=50)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.order.order_number}: {self.from_status} -> {self.to_status} at {self.created_at}"
