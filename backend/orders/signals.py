from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from .models import Complaint, Notification, Order, OrderStatusHistory


@receiver(pre_save, sender=Order)
def cache_previous_order_status(sender, instance, **kwargs):
    if instance.pk is None:
        instance._previous_status = None
        return
    try:
        instance._previous_status = Order.objects.only('status').get(pk=instance.pk).status
    except Order.DoesNotExist:
        instance._previous_status = None


@receiver(post_save, sender=Order)
def create_order_status_notifications(sender, instance, **kwargs):
    previous_status = getattr(instance, '_previous_status', None)
    if previous_status and previous_status != instance.status:
        message = f"Order #{instance.pk} status changed from {previous_status} to {instance.status}."
        for recipient in {instance.buyer, instance.artisan}:
            Notification.objects.create(
                recipient=recipient,
                title=f"Order #{instance.pk} updated",
                message=message,
            )
        OrderStatusHistory.objects.create(
            order=instance,
            status=instance.status,
            updated_by=instance.artisan,
            notes=message,
        )


@receiver(pre_save, sender=Complaint)
def cache_previous_complaint_status(sender, instance, **kwargs):
    if instance.pk is None:
        instance._previous_status = None
        return
    try:
        instance._previous_status = Complaint.objects.only('status').get(pk=instance.pk).status
    except Complaint.DoesNotExist:
        instance._previous_status = None


@receiver(post_save, sender=Complaint)
def create_complaint_resolution_notification(sender, instance, **kwargs):
    previous_status = getattr(instance, '_previous_status', None)
    if previous_status != 'resolved' and instance.status == 'resolved':
        message = (
            f"Your complaint #{instance.pk} has been resolved. "
            f"Admin response: {instance.admin_response or 'No additional notes provided.'}"
        )
        Notification.objects.create(
            recipient=instance.complainant,
            title='Complaint resolved',
            message=message,
        )
