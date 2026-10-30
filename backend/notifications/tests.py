from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from notifications.models import Notification
from notifications.services import create_notification

User = get_user_model()

class NotificationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='notif_user', email='notif@test.com', password='pass')

    def test_notification_flow(self):
        create_notification(
            recipient=self.user,
            notification_type='order_created',
            title='Order Placed',
            message='Your order has been received.',
            link='/orders/1'
        )
        self.assertEqual(Notification.objects.count(), 1)

        self.client.force_authenticate(user=self.user)
        # Check unread count
        count_resp = self.client.get("/api/notifications/unread-count/")
        self.assertEqual(count_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(count_resp.data['unread_count'], 1)

        # Mark read
        notif = Notification.objects.first()
        read_resp = self.client.post(f"/api/notifications/{notif.id}/read/")
        self.assertEqual(read_resp.status_code, status.HTTP_200_OK)
        notif.refresh_from_db()
        self.assertTrue(notif.is_read)

        # Mark all read
        all_read_resp = self.client.post("/api/notifications/mark-all-read/")
        self.assertEqual(all_read_resp.status_code, status.HTTP_200_OK)
