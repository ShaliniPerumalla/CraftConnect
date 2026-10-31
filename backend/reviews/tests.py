from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from orders.models import Order
from reviews.models import Review
from marketplace.models import CreatorProfile

User = get_user_model()

class ReviewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.customer = User.objects.create_user(username='rev_cust', email='rcust@test.com', password='pass')
        self.creator = User.objects.create_user(username='rev_creator', email='rcreator@test.com', password='pass')
        self.other_user = User.objects.create_user(username='other_u', email='other@test.com', password='pass')

        self.creator_profile = CreatorProfile.objects.create(
            user=self.creator,
            name="Master Artisan",
            rating=5.0,
            reviews_count=0
        )

        self.order = Order.objects.create(
            customer=self.customer,
            creator=self.creator,
            total_amount=2500,
            status='delivered'
        )

    def test_customer_can_review_delivered_order(self):
        self.client.force_authenticate(user=self.customer)
        response = self.client.post("/api/reviews/", {
            "order": self.order.id,
            "rating": 5,
            "comment": "Exceeded all expectations!"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 1)

        # Verify creator rating updated
        self.creator_profile.refresh_from_db()
        self.assertEqual(float(self.creator_profile.rating), 5.0)
        self.assertEqual(self.creator_profile.reviews_count, 1)

    def test_duplicate_review_prevented(self):
        self.client.force_authenticate(user=self.customer)
        self.client.post("/api/reviews/", {"order": self.order.id, "rating": 4, "comment": "Nice"})

        # Try posting second review for same order
        resp = self.client.post("/api/reviews/", {"order": self.order.id, "rating": 5, "comment": "Duplicate attempt"})
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthorized_user_cannot_review(self):
        self.client.force_authenticate(user=self.other_user)
        resp = self.client.post("/api/reviews/", {"order": self.order.id, "rating": 5, "comment": "Not my order"})
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_cannot_review_non_delivered_order(self):
        pending_order = Order.objects.create(
            customer=self.customer,
            creator=self.creator,
            total_amount=1000,
            status='production'
        )
        self.client.force_authenticate(user=self.customer)
        resp = self.client.post("/api/reviews/", {"order": pending_order.id, "rating": 5, "comment": "Early review"})
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
