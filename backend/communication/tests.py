from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from requirements_app.models import Requirement
from communication.models import Conversation

User = get_user_model()

class CommunicationAPITests(APITestCase):
    def setUp(self):
        self.customer = User.objects.create_user(username='buyer_c', password='password123')
        self.creator = User.objects.create_user(username='artisan_c', password='password123')

        self.req = Requirement.objects.create(
            customer=self.customer,
            title='Clay Pot',
            description='Test pot',
            category='Pottery',
            budget=500.00,
            deadline=(timezone.now() + timedelta(days=7)).date()
        )
        self.conv = Conversation.objects.create(
            customer=self.customer,
            creator=self.creator,
            requirement=self.req
        )

        token_res = self.client.post('/api/token/', {'username': 'buyer_c', 'password': 'password123'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token_res.data["access"]}')

    def test_send_and_list_message(self):
        post_res = self.client.post(
            f'/api/communication/conversations/{self.conv.id}/messages/',
            {'body': 'Hello from test!'},
            format='json'
        )
        self.assertEqual(post_res.status_code, status.HTTP_201_CREATED)

        get_res = self.client.get(f'/api/communication/conversations/{self.conv.id}/messages/')
        self.assertEqual(get_res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(get_res.data), 1)
