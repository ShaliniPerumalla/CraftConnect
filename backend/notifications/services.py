from .models import Notification

def create_notification(recipient, notification_type, title, message, link=None):
    """
    Utility helper to create a notification for a user.
    Silently handles cases where recipient is missing or invalid.
    """
    if not recipient:
        return None
    try:
        return Notification.objects.create(
            recipient=recipient,
            notification_type=notification_type,
            title=title,
            message=message,
            link=link or ''
        )
    except Exception as e:
        print(f"Error creating notification: {e}")
        return None
