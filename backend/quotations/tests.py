from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from requirements_app.models import Requirement

User = get_user_model()

class QuotationAPITests(APITestCase):
    def setUp(self):
        self.customer = User.objects.create_user(username='buyer_q', password='password123')
        self.creator = User.objects.create_user(username='artisan_q', password='password123')

        self.req = Requirement.objects.create(
            customer=self.customer,
            title='Copper Urli Pot',
            description='Traditional hammered decorative bowl',
            category='Metalwork',
            budget=4500.00,
            deadline=(timezone.now() + timedelta(days=14)).date()
        )

        token_res = self.client.post('/api/token/', {'username': 'artisan_q', 'password': 'password123'})
        self.token = token_res.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_submit_quotation(self):
        delivery_date = (timezone.now() + timedelta(days=7)).date().isoformat()
        payload = {
            'requirement': self.req.id,
            'price': '4200.00',
            'delivery_charge': '200.00',
            'estimated_delivery_date': delivery_date,
            'description': 'Pure hammered copper with protective lacquer coating.'
        }
        res = self.client.post('/api/quotations/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(float(res.data['price']), 4200.00)
        self.assertEqual(float(res.data['total_amount']), 4400.00)

        # Creator lists their submitted quotations
        my_quotes_res = self.client.get('/api/quotations/?role=creator')
        self.assertEqual(my_quotes_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(my_quotes_res.data), 1)

    def test_accept_quotation_workflow(self):
        delivery_date = (timezone.now() + timedelta(days=7)).date().isoformat()
        quote = self.client.post('/api/quotations/', {
            'requirement': self.req.id,
            'price': '4000.00',
            'estimated_delivery_date': delivery_date,
            'description': 'Hand hammered finish.'
        }, format='json').data

        # Authenticate as customer to accept
        cust_token = self.client.post('/api/token/', {'username': 'buyer_q', 'password': 'password123'}).data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {cust_token}')

        # Customer accepts quote
        accept_res = self.client.post(f'/api/quotations/{quote["id"]}/accept/')
        self.assertEqual(accept_res.status_code, status.HTTP_200_OK)

        # Check requirement status is accepted
        self.req.refresh_from_db()
        self.assertEqual(self.req.status, 'accepted')
