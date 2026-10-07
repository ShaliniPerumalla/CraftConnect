from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class RequirementAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='buyer_test', password='password123')
        token_res = self.client.post('/api/token/', {'username': 'buyer_test', 'password': 'password123'})
        self.token = token_res.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_create_requirement_authenticated(self):
        deadline_date = (timezone.now() + timedelta(days=15)).date().isoformat()
        payload = {
            'title': 'Carved Teak Mirror',
            'description': 'Handcrafted oval wall mirror with brass inlay.',
            'category': 'Woodwork',
            'budget': '8500.00',
            'deadline': deadline_date
        }
        res = self.client.post('/api/requirements/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_create_requirement_unauthenticated(self):
        self.client.credentials()
        deadline_date = (timezone.now() + timedelta(days=10)).date().isoformat()
        payload = {
            'title': 'Blocked Item',
            'description': 'Test description',
            'category': 'Pottery',
            'budget': '1000.00',
            'deadline': deadline_date
        }
        res = self.client.post('/api/requirements/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
