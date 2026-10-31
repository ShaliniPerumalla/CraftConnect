from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from complaints.models import Complaint

User = get_user_model()

class ComplaintTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='comp_user', email='comp@test.com', password='pass')
        self.admin = User.objects.create_superuser(username='comp_admin', email='admin@test.com', password='pass')

    def test_user_can_create_and_view_complaint(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/complaints/", {
            "subject": "Delay in delivery",
            "description": "Item was expected 2 days ago.",
            "category": "Delivery",
            "priority": "High"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Complaint.objects.count(), 1)
        ticket = Complaint.objects.first()
        self.assertTrue(ticket.ticket_id.startswith("CMP-"))

        # User views list
        list_resp = self.client.get("/api/complaints/")
        self.assertEqual(list_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_resp.data), 1)

    def test_admin_can_resolve_complaint(self):
        complaint = Complaint.objects.create(
            user=self.user,
            subject="Damaged ceramic cup",
            description="Cup arrived broken in pieces.",
            category="Product"
        )
        self.client.force_authenticate(user=self.admin)
        resolve_resp = self.client.post(f"/api/complaints/{complaint.ticket_id}/resolve/", {
            "resolution_notes": "Replacement approved and dispatched to customer.",
            "status": "Resolved"
        })
        self.assertEqual(resolve_resp.status_code, status.HTTP_200_OK)
        complaint.refresh_from_db()
        self.assertEqual(complaint.status, "Resolved")
        self.assertEqual(complaint.resolved_by, self.admin)
        self.assertIsNotNone(complaint.resolved_at)
