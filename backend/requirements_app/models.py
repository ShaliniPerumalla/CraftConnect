from django.db import models
from django.conf import settings

class Requirement(models.Model):
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('quoted', 'Quoted'),
        ('accepted', 'Accepted'),
        ('cancelled', 'Cancelled'),
    )

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='requirements'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    deadline = models.DateField()
    delivery_address = models.TextField(blank=True, null=True)
    reference_image = models.URLField(max_length=500, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.customer.email} ({self.status})"