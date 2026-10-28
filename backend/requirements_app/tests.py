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

    def test_creator_views_open_requirements(self):
        # Create an open requirement by buyer
        deadline_date = (timezone.now() + timedelta(days=15)).date().isoformat()
        self.client.post('/api/requirements/', {
            'title': 'Carved Teak Mirror',
            'description': 'Handcrafted oval wall mirror with brass inlay.',
            'category': 'Woodwork',
            'budget': '8500.00',
            'deadline': deadline_date
        }, format='json')

        # Create a creator user
        User.objects.create_user(username='artisan_req', password='password123')
        creator_token = self.client.post('/api/token/', {'username': 'artisan_req', 'password': 'password123'}).data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {creator_token}')

        # Creator views marketplace
        res = self.client.get('/api/requirements/?role=creator')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['title'], 'Carved Teak Mirror')
