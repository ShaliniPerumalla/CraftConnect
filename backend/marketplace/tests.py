
import io
from decimal import Decimal

from PIL import Image
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from .models import Category, CreatorProfile, Product

User = get_user_model()


def create_test_image(
    filename="test.png",
    size=(100, 100),
    color="blue",
    format="PNG",
):
    file_obj = io.BytesIO()
    image = Image.new("RGB", size, color=color)
    image.save(file_obj, format=format)
    file_obj.seek(0)
    return SimpleUploadedFile(
        filename,
        file_obj.read(),
        content_type=f"image/{format.lower()}",
    )


class MarketplaceTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.user_a = User.objects.create_user(
            username="creator_a",
            email="creator_a@example.com",
            password="Password123!",
            first_name="Maren",
            last_name="Holt",
        )
        self.profile_a = CreatorProfile.objects.create(
            user=self.user_a,
            name="Maren Holt",
            specialty="Walnut & oak woodwork",
            bio="Handmade woodwork master",
            skills="Wood carving, joinery",
            location="Asheville, NC",
            rating=Decimal("4.90"),
        )

        self.user_b = User.objects.create_user(
            username="creator_b",
            email="creator_b@example.com",
            password="Password123!",
            first_name="Priya",
            last_name="Nair",
        )
        self.profile_b = CreatorProfile.objects.create(
            user=self.user_b,
            name="Priya Nair",
            specialty="Hand-thrown stoneware",
            bio="Pottery artisan",
            skills="Ceramics, glazing",
            location="Portland, OR",
            rating=Decimal("5.00"),
        )

        self.customer = User.objects.create_user(
            username="customer_user",
            email="customer@example.com",
            password="Password123!",
            first_name="Jane",
            last_name="Shopper",
        )

        self.cat_woodwork = Category.objects.create(
            name="Woodwork",
            slug="woodwork",
            icon="Hammer",
            description="Handcrafted wooden pieces",
        )
        self.cat_pottery = Category.objects.create(
            name="Pottery & Ceramics",
            slug="pottery",
            icon="Package",
            description="Handmade stoneware",
        )

        self.product_a = Product.objects.create(
            creator=self.profile_a,
            category=self.cat_woodwork,
            name="Handcrafted Wooden Serving Board",
            description="Solid walnut cutting board",
            price=Decimal("699.00"),
            stock=12,
            materials="Walnut wood",
            tag="Bestseller",
            rating=Decimal("4.90"),
            image="https://example.com/wood-board.jpg",
        )
        self.product_b = Product.objects.create(
            creator=self.profile_b,
            category=self.cat_pottery,
            name="Handmade Ceramic Mug",
            description="Glazed stoneware coffee mug",
            price=Decimal("350.00"),
            stock=8,
            materials="Stoneware clay",
            tag="New",
            rating=Decimal("5.00"),
            image="https://example.com/mug.jpg",
        )

    def test_category_and_product_foreign_key(self):
        self.assertEqual(self.cat_woodwork.pieces_count, 1)
        self.assertEqual(self.cat_pottery.pieces_count, 1)

    def test_foreign_key_category_set_null_on_delete(self):
        product_id = self.product_a.id
        self.cat_woodwork.delete()
        self.product_a.refresh_from_db()
        self.assertIsNone(self.product_a.category)
        self.assertTrue(Product.objects.filter(id=product_id).exists())

    def test_foreign_key_creator_cascade_on_delete(self):
        product_id = self.product_a.id
        self.profile_a.delete()
        self.assertFalse(Product.objects.filter(id=product_id).exists())

    def test_public_can_list_and_view_creators(self):
        response = self.client.get(reverse("creator-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        detail_url = reverse("creator-detail", args=[self.profile_a.id])
        detail_response = self.client.get(detail_url)
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_response.data["name"], "Maren Holt")
        self.assertEqual(
            detail_response.data["specialty"],
            "Walnut & oak woodwork",
        )

    def test_creator_can_update_own_profile(self):
        self.client.force_authenticate(user=self.user_a)
        url = reverse("creator-detail", args=[self.profile_a.id])
        response = self.client.patch(
            url,
            {
                "name": "Maren Holt Studio",
                "bio": "Updated bio with award-winning craftsmanship.",
                "location": "Charlotte, NC",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.profile_a.refresh_from_db()
        self.assertEqual(self.profile_a.name, "Maren Holt Studio")
        self.assertEqual(self.profile_a.location, "Charlotte, NC")

    def test_creator_cannot_modify_other_creator_profile(self):
        self.client.force_authenticate(user=self.user_b)
        url = reverse("creator-detail", args=[self.profile_a.id])
        response = self.client.patch(url, {"name": "Hacked Name"})
        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )
        self.profile_a.refresh_from_db()
        self.assertEqual(self.profile_a.name, "Maren Holt")

    def test_creator_me_endpoint(self):
        self.client.force_authenticate(user=self.user_a)
        url = reverse("creator-me")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Maren Holt")

        patch_res = self.client.patch(
            url,
            {"skills": "Hand turning, Lathe work"},
        )
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.profile_a.refresh_from_db()
        self.assertEqual(self.profile_a.skills, "Hand turning, Lathe work")

    def test_public_can_view_products(self):
        response = self.client.get(reverse("product-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        detail_url = reverse("product-detail", args=[self.product_a.id])
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["name"],
            "Handcrafted Wooden Serving Board",
        )
        self.assertEqual(response.data["creator"], "Maren Holt")

    def test_authenticated_creator_can_create_product(self):
        self.client.force_authenticate(user=self.user_a)
        url = reverse("product-list")
        payload = {
            "name": "Oak Dining Table",
            "description": "Custom dining table made from reclaimed white oak",
            "price": "1899.00",
            "stock": 3,
            "materials": "Reclaimed oak wood",
            "tag": "New",
            "category": "woodwork",
            "image": "https://example.com/oak-table.jpg",
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "Oak Dining Table")
        self.assertEqual(response.data["creator"], "Maren Holt")
        self.assertEqual(response.data["creatorId"], self.profile_a.id)

    def test_validate_required_product_fields(self):
        self.client.force_authenticate(user=self.user_a)
        url = reverse("product-list")

        response = self.client.post(
            url,
            {"name": "", "price": "100.00", "stock": 5},
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        response = self.client.post(
            url,
            {"name": "Valid Title", "price": "-10.00", "stock": 5},
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        response = self.client.post(
            url,
            {"name": "Valid Title", "price": "50.00", "stock": -2},
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_creator_can_update_own_product(self):
        self.client.force_authenticate(user=self.user_a)
        url = reverse("product-detail", args=[self.product_a.id])
        response = self.client.patch(
            url,
            {"price": "749.00", "stock": 15},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.product_a.refresh_from_db()
        self.assertEqual(self.product_a.price, Decimal("749.00"))
        self.assertEqual(self.product_a.stock, 15)

    def test_creator_cannot_modify_other_creator_product(self):
        self.client.force_authenticate(user=self.user_b)
        url = reverse("product-detail", args=[self.product_a.id])

        response = self.client.patch(url, {"price": "1.00"})
        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

        delete_response = self.client.delete(url)
        self.assertEqual(
            delete_response.status_code,
            status.HTTP_403_FORBIDDEN,
        )
        self.assertTrue(Product.objects.filter(id=self.product_a.id).exists())

    def test_creator_can_delete_own_product(self):
        self.client.force_authenticate(user=self.user_a)
        url = reverse("product-detail", args=[self.product_a.id])
        response = self.client.delete(url)
        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )
        self.assertFalse(Product.objects.filter(id=self.product_a.id).exists())

    def test_unauthenticated_cannot_create_product(self):
        response = self.client.post(
            reverse("product-list"),
            {"name": "Craft", "price": "100.00"},
        )
        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )

    def test_creator_my_products_endpoint(self):
        self.client.force_authenticate(user=self.user_a)
        response = self.client.get(reverse("creator-my-products"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        product_names = [item["name"] for item in response.data]
        self.assertIn("Handcrafted Wooden Serving Board", product_names)
        self.assertNotIn("Handmade Ceramic Mug", product_names)

    def test_search_products_by_keyword(self):
        url = reverse("product-list")
        response = self.client.get(url, {"search": "walnut"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = (
            response.data
            if isinstance(response.data, list)
            else response.data.get("results", [])
        )
        self.assertEqual(len(results), 1)
        self.assertEqual(
            results[0]["name"],
            "Handcrafted Wooden Serving Board",
        )

        response = self.client.get(url, {"q": "stoneware"})
        results = (
            response.data
            if isinstance(response.data, list)
            else response.data.get("results", [])
        )
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "Handmade Ceramic Mug")

    def test_filter_products_by_category(self):
        response = self.client.get(
            reverse("product-list"),
            {"category": "woodwork"},
        )
        results = (
            response.data
            if isinstance(response.data, list)
            else response.data.get("results", [])
        )
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["category"], "woodwork")

    def test_filter_products_by_price_range(self):
        response = self.client.get(
            reverse("product-list"),
            {"max_price": "400"},
        )
        results = (
            response.data
            if isinstance(response.data, list)
            else response.data.get("results", [])
        )
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "Handmade Ceramic Mug")

    def test_filter_products_by_creator(self):
        response = self.client.get(
            reverse("product-list"),
            {"creator": self.profile_a.id},
        )
        results = (
            response.data
            if isinstance(response.data, list)
            else response.data.get("results", [])
        )
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["creator"], "Maren Holt")

    def test_filter_creators_by_search_and_location(self):
        url = reverse("creator-list")
        response = self.client.get(url, {"search": "Priya"})
        results = (
            response.data
            if isinstance(response.data, list)
            else response.data.get("results", [])
        )
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "Priya Nair")

        response = self.client.get(url, {"location": "Asheville"})
        results = (
            response.data
            if isinstance(response.data, list)
            else response.data.get("results", [])
        )
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "Maren Holt")

    def test_image_upload_success(self):
        url = reverse("upload-image")
        image_file = create_test_image("test_craft.png")
        response = self.client.post(
            url,
            {"image": image_file},
            format="multipart",
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )
        self.assertIn("url", response.data)
        self.assertIn("public_id", response.data)

    def test_image_upload_reject_invalid_type(self):
        url = reverse("upload-image")
        bad_file = SimpleUploadedFile(
            "script.py",
            b"print('hello')",
            content_type="text/x-python",
        )
        response = self.client.post(
            url,
            {"image": bad_file},
            format="multipart",
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("error", response.data)

    def test_image_upload_reject_empty(self):
        url = reverse("upload-image")
        response = self.client.post(url, {}, format="multipart")
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
