from django.test import TestCase

from .models import User
from .serializers import UserProfileSerializer, UserRegistrationSerializer


class UserAuthAndProfileTests(TestCase):
    def test_registration_rejects_duplicate_email(self):
        User.objects.create_user(
            name="Existing User",
            email="duplicate@example.com",
            password="hashedpass123",
            role=User.CUSTOMER,
            email_verified=True,
        )

        serializer = UserRegistrationSerializer(
            data={
                "name": "Another User",
                "email": "duplicate@example.com",
                "password": "newpass123",
                "role": User.CUSTOMER,
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)

    def test_profile_serializer_updates_customer_profile_fields(self):
        user = User.objects.create_user(
            name="Customer User",
            email="profile@example.com",
            password="hashedpass123",
            role=User.CUSTOMER,
            email_verified=True,
        )

        serializer = UserProfileSerializer(
            user,
            data={
                "name": "Updated Customer",
                "phone": "+91 98765 43210",
                "address": "12 Market Street",
                "city": "Hyderabad",
                "state": "Telangana",
                "pincode": "500001",
            },
            partial=True,
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)
        serializer.save()

        user.refresh_from_db()
        self.assertEqual(user.name, "Updated Customer")
        self.assertEqual(user.phone, "+91 98765 43210")
        self.assertEqual(user.address, "12 Market Street")
        self.assertEqual(user.city, "Hyderabad")
        self.assertEqual(user.state, "Telangana")
        self.assertEqual(user.pincode, "500001")
