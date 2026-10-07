from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from requirements_app.models import Requirement

User = get_user_model()

class Member3Tests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test_user', password='password123')
        # Obtain JWT
        response = self.client.post('/api/token/', {'username': 'test_user', 'password': 'password123'})
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_create_and_list_requirement(self):
        # Create
        create_res = self.client.post('/api/requirements/', {
            'title': 'Test Handloom Rug',
            'description': 'Pure wool 4x6 handloom rug',
            'budget': 8000.00
        }, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)

        # List
        list_res = self.client.get('/api/requirements/')
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(list_res.data), 1)
# Create your tests here.
