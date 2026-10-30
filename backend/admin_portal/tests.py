from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class AdminPortalSecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.regular_user = User.objects.create_user(username='regular', email='reg@test.com', password='pass')
        self.admin_user = User.objects.create_superuser(username='superadmin', email='super@test.com', password='pass')

    def test_normal_user_denied_admin_access(self):
        self.client.force_authenticate(user=self.regular_user)
        resp = self.client.get("/api/admin/statistics/")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_access_statistics(self):
        self.client.force_authenticate(user=self.admin_user)
        resp = self.client.get("/api/admin/statistics/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("users", resp.data)
        self.assertIn("orders", resp.data)
        self.assertIn("complaints", resp.data)
