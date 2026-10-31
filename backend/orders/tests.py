from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from requirements_app.models import Requirement
from quotations.models import Quotation
from orders.models import Order, OrderStatusHistory

User = get_user_model()

class OrderLifecycleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.customer = User.objects.create_user(
            username='cust_test',
            email='cust@test.com',
            password='pass'
        )
        self.creator = User.objects.create_user(
            username='creator_test',
            email='creator@test.com',
            password='pass'
        )
        setattr(self.creator, 'role', 'creator')
        self.creator.save()

        self.requirement = Requirement.objects.create(
            customer=self.customer,
            title='Custom Oak Table',
            description='Oak dining table with modern legs',
            category='Woodwork',
            budget=15000.00,
            quantity=1,
            deadline='2026-12-01',
            delivery_address='Bangalore, India'
        )

        self.quotation = Quotation.objects.create(
            requirement=self.requirement,
            creator=self.creator,
            price=14500.00,
            delivery_charge=500.00,
            description='Premium oak table crafted by hand.',
            estimated_delivery_date='2026-11-25',
            status='pending'
        )

    def test_quotation_acceptance_creates_order(self):
        self.client.force_authenticate(user=self.customer)
        response = self.client.post(f"/api/quotations/{self.quotation.id}/accept/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        order = Order.objects.filter(quotation=self.quotation).first()
        self.assertIsNotNone(order)
        self.assertEqual(order.customer, self.customer)
        self.assertEqual(order.creator, self.creator)
        self.assertEqual(float(order.total_amount), 15000.00)
        self.assertEqual(order.status, 'pending')
        self.assertEqual(order.items.count(), 1)

    def test_order_lifecycle_flow(self):
        # 1. Accept quotation -> creates order
        self.client.force_authenticate(user=self.customer)
        self.client.post(f"/api/quotations/{self.quotation.id}/accept/")
        order = Order.objects.get(quotation=self.quotation)

        # 2. Creator uploads design
        self.client.force_authenticate(user=self.creator)
        upload_resp = self.client.post(f"/api/orders/{order.id}/design-upload/", {
            "design_file_url": "https://example.com/mockup1.jpg",
            "design_notes": "First draft of oak wood finish"
        })
        self.assertEqual(upload_resp.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertEqual(order.status, 'design_review')
        self.assertEqual(order.design_status, 'submitted')

        # 3. Customer approves design
        self.client.force_authenticate(user=self.customer)
        approve_resp = self.client.post(f"/api/orders/{order.id}/design-review/", {
            "action": "approve",
            "feedback": "Looks fantastic, please proceed!"
        })
        self.assertEqual(approve_resp.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertEqual(order.status, 'production')
        self.assertEqual(order.design_status, 'approved')

        # 4. Creator marks ready for delivery
        self.client.force_authenticate(user=self.creator)
        ready_resp = self.client.patch(f"/api/orders/{order.id}/status/", {
            "status": "ready_for_delivery"
        })
        self.assertEqual(ready_resp.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertEqual(order.status, 'ready_for_delivery')

        # 5. Creator marks shipped
        ship_resp = self.client.patch(f"/api/orders/{order.id}/status/", {
            "status": "shipped",
            "tracking_number": "TRK123456",
            "courier_name": "BlueDart"
        })
        self.assertEqual(ship_resp.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertEqual(order.status, 'shipped')
        self.assertEqual(order.tracking_number, 'TRK123456')

        # 6. Delivered
        deliv_resp = self.client.patch(f"/api/orders/{order.id}/status/", {
            "status": "delivered"
        })
        self.assertEqual(deliv_resp.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertEqual(order.status, 'delivered')

    def test_invalid_transition_prevented(self):
        order = Order.objects.create(
            customer=self.customer,
            creator=self.creator,
            total_amount=1000,
            status='production'
        )
        self.client.force_authenticate(user=self.creator)
        # Attempt illegal jump from production directly to delivered
        resp = self.client.patch(f"/api/orders/{order.id}/status/", {
            "status": "delivered"
        })
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cancellation_rules(self):
        order = Order.objects.create(
            customer=self.customer,
            creator=self.creator,
            total_amount=1000,
            status='production'
        )
        self.client.force_authenticate(user=self.customer)
        # Cannot cancel once in production
        resp = self.client.post(f"/api/orders/{order.id}/cancel/", {"reason": "Changed my mind"})
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

        # Pending order can be cancelled
        order2 = Order.objects.create(
            customer=self.customer,
            creator=self.creator,
            total_amount=500,
            status='pending'
        )
        resp2 = self.client.post(f"/api/orders/{order2.id}/cancel/", {"reason": "No longer needed"})
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        order2.refresh_from_db()
        self.assertEqual(order2.status, 'cancelled')
