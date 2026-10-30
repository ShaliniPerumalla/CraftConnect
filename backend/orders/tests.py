from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from .models import Complaint, Notification, Order

User = get_user_model()


class OrdersApiTests(TestCase):
    def setUp(self):
        self.buyer = User.objects.create_user(username='buyer', password='pass1234')
        self.artisan = User.objects.create_user(username='artisan', password='pass1234')
        self.admin = User.objects.create_superuser(username='admin', password='pass1234', email='admin@example.com')
        self.client = APIClient()

    def test_root_url_returns_api_status(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('CraftConnect', response.json()['message'])

    def test_order_status_update_creates_notification(self):
        self.client.force_authenticate(user=self.buyer)
        response = self.client.post(
            '/api/orders/',
            {
                'artisan': self.artisan.id,
                'total_amount': '150.00',
                'shipping_address': '123 Main St',
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        order = Order.objects.get(pk=response.data['id'])

        self.client.force_authenticate(user=self.artisan)
        patch_response = self.client.patch(
            f'/api/orders/{order.id}/update-status/',
            {'status': 'accepted'},
            format='json',
        )
        self.assertEqual(patch_response.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertEqual(order.status, 'accepted')
        self.assertTrue(Notification.objects.filter(recipient=self.buyer).exists())
        self.assertTrue(Notification.objects.filter(recipient=self.artisan).exists())

    def test_admin_can_resolve_complaint(self):
        order = Order.objects.create(
            buyer=self.buyer,
            artisan=self.artisan,
            total_amount='200.00',
            shipping_address='456 Fourth Ave',
            status='delivered',
        )
        complaint = Complaint.objects.create(
            order=order,
            complainant=self.buyer,
            subject='Issue with order',
            description='Package arrived damaged',
            status='open',
        )

        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f'/api/admin/complaints/{complaint.id}/resolve/',
            {'status': 'resolved', 'admin_response': 'Refund processed'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        complaint.refresh_from_db()
        self.assertEqual(complaint.status, 'resolved')
        self.assertTrue(Notification.objects.filter(recipient=self.buyer).exists())
