from django.db import models
from django.conf import settings

class Notification(models.Model):
    TYPE_CHOICES = (
        ('quotation', 'New Quotation'),
        ('quotation_accepted', 'Quotation Accepted'),
        ('quotation_rejected', 'Quotation Rejected'),
        ('order_created', 'Order Created'),
        ('order_status', 'Order Status Updated'),
        ('design_uploaded', 'Design Uploaded'),
        ('design_approved', 'Design Approved'),
        ('design_rejected', 'Design Rejected'),
        ('order_completed', 'Order Completed'),
        ('review', 'New Review'),
        ('complaint_update', 'Complaint Update'),
        ('message', 'New Message'),
        ('general', 'General Notification'),
    )

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    notification_type = models.CharField(
        max_length=50,
        choices=TYPE_CHOICES,
        default='general'
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    link = models.CharField(max_length=255, blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.notification_type}] {self.recipient.email} - {self.title}"
