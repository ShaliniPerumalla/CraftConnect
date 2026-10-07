import io
from decimal import Decimal
from PIL import Image

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from .models import Category, CreatorProfile, Product, ProductImage

User = get_user_model()


def create_test_image(filename="test.png", size=(100, 100), color="blue", format="PNG"):
    file_obj = io.BytesIO()
    image = Image.new("RGB", size, color=color)
    image.save(file_obj, format=format)
    file_obj.seek(0)
    return SimpleUploadedFile(filename, file_obj.read(), content_type=f"image/{format.lower()}")


class MarketplaceTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # User 1: Creator A
        self.user_a = User.objects.create_user(
            username="creator_a",
            email="creator_a@example.com",
            password="Password123!",
            first_name="Maren",
            last_name="Holt"
        )
        self.profile_a = CreatorProfile.objects.create(
            user=self.user_a,
            name="Maren Holt",
            specialty="Walnut & oak woodwork",
            bio="Handmade woodwork master",
            skills="Wood carving, joinery",
            location="Asheville, NC",
            rating=Decimal("4.90")
        )

        # User 2: Creator B
        self.user_b = User.objects.create_user(
            username="creator_b",
            email="creator_b@example.com",
            password="Password123!",
            first_name="Priya",
            last_name="Nair"
        )
        self.profile_b = CreatorProfile.objects.create(
            user=self.user_b,
            name="Priya Nair",
            specialty="Hand-thrown stoneware",
            bio="Pottery artisan",
            skills="Ceramics, glazing",
            location="Portland, OR",
            rating=Decimal("5.00")
        )

        # User 3: Customer (Regular user with no creator profile)
        self.customer = User.objects.create_user(
            username="customer_user",
            email="customer@example.com",
            password="Password123!",
            first_name="Jane",
            last_name="Shopper"
        )

        # Categories
        self.cat_woodwork = Category.objects.create(
            name="Woodwork",
            slug="woodwork",
            icon="Hammer",
            description="Handcrafted wooden pieces"
        )
        self.cat_pottery = Category.objects.create(
            name="Pottery & Ceramics",
            slug="pottery",
            icon="Package",
            description="Handmade stoneware"
        )

        # Products
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
            image="https://example.com/wood-board.jpg"
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
            image="https://example.com/mug.jpg"
        )

    # =========================================================================
    # A. DATABASE & FOREIGN-KEY RELATIONSHIP TESTS
    # =========================================================================

    def test_category_and_product_foreign_key(self):
        """Verify Category to Product relationship and pieces count."""
        self.assertEqual(self.cat_woodwork.pieces_count, 1)
        self.assertEqual(self.cat_pottery.pieces_count, 1)

    def test_foreign_key_category_set_null_on_delete(self):
        """When a category is deleted, product.category is SET_NULL, product is preserved."""
        product_id = self.product_a.id
        self.cat_woodwork.delete()
        self.product_a.refresh_from_db()
        self.assertIsNone(self.product_a.category)
        self.assertTrue(Product.objects.filter(id=product_id).exists())

    def test_foreign_key_creator_cascade_on_delete(self):
        """When a creator profile is deleted, their products are cascaded."""
        product_id = self.product_a.id
        self.profile_a.delete()
        self.assertFalse(Product.objects.filter(id=product_id).exists())

    # =========================================================================
    # B. CREATOR PROFILES TESTS
    # =========================================================================

    def test_public_can_list_and_view_creators(self):
        """Public/unauthenticated users can view creator listings and details."""
        url = reverse("creator-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        detail_url = reverse("creator-detail", args=[self.profile_a.id])
        detail_response = self.client.get(detail_url)
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_response.data["name"], "Maren Holt")
        self.assertEqual(detail_response.data["specialty"], "Walnut & oak woodwork")

    def test_creator_can_update_own_profile(self):
        """A creator can update their own profile details."""
        self.client.force_authenticate(user=self.user_a)
        url = reverse("creator-detail", args=[self.profile_a.id])
        data = {
            "name": "Maren Holt Studio",
            "bio": "Updated bio with award-winning craftsmanship.",
            "location": "Charlotte, NC"
        }
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.profile_a.refresh_from_db()
        self.assertEqual(self.profile_a.name, "Maren Holt Studio")
        self.assertEqual(self.profile_a.location, "Charlotte, NC")

    def test_creator_cannot_modify_other_creator_profile(self):
        """Enforce that a creator can modify ONLY their own profile (403 Forbidden)."""
        self.client.force_authenticate(user=self.user_b)
        url = reverse("creator-detail", args=[self.profile_a.id])
        data = {"name": "Hacked Name"}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.profile_a.refresh_from_db()
        self.assertEqual(self.profile_a.name, "Maren Holt")

    def test_creator_me_endpoint(self):
        """Current authenticated user can retrieve and update their profile via /creators/me/."""
        self.client.force_authenticate(user=self.user_a)
        url = reverse("creator-me")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Maren Holt")

        patch_res = self.client.patch(url, {"skills": "Hand turning, Lathe work"})
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.profile_a.refresh_from_db()
        self.assertEqual(self.profile_a.skills, "Hand turning, Lathe work")

    # =========================================================================
    # C. PRODUCTS / SERVICES CRUD & VALIDATION TESTS
    # =========================================================================

    def test_public_can_view_products(self):
        """Unauthenticated customer can list products and view product detail."""
        url = reverse("product-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        detail_url = reverse("product-detail", args=[self.product_a.id])
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Handcrafted Wooden Serving Board")
        self.assertEqual(response.data["creator"], "Maren Holt")

    def test_authenticated_creator_can_create_product(self):
        """Creator can add a new product/service."""
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
            "image": "https://example.com/oak-table.jpg"
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "Oak Dining Table")
        self.assertEqual(response.data["creator"], "Maren Holt")
        self.assertEqual(response.data["creatorId"], self.profile_a.id)

    def test_validate_required_product_fields(self):
        """Validation on required fields: title not empty, price > 0, stock >= 0."""
        self.client.force_authenticate(user=self.user_a)
        url = reverse("product-list")

        # Empty name
        res = self.client.post(url, {"name": "", "price": "100.00", "stock": 5})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        # Zero or negative price
        res = self.client.post(url, {"name": "Valid Title", "price": "-10.00", "stock": 5})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        # Negative stock
        res = self.client.post(url, {"name": "Valid Title", "price": "50.00", "stock": -2})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_creator_can_update_own_product(self):
        """Creator can edit their own product."""
        self.client.force_authenticate(user=self.user_a)
        url = reverse("product-detail", args=[self.product_a.id])
        response = self.client.patch(url, {"price": "749.00", "stock": 15})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.product_a.refresh_from_db()
        self.assertEqual(self.product_a.price, Decimal("749.00"))
        self.assertEqual(self.product_a.stock, 15)

    def test_creator_cannot_modify_other_creator_product(self):
        """Another creator or user CANNOT edit or delete someone else's product (403)."""
        self.client.force_authenticate(user=self.user_b)
        url = reverse("product-detail", args=[self.product_a.id])

        # Attempt PATCH
        response = self.client.patch(url, {"price": "1.00"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Attempt DELETE
        del_response = self.client.delete(url)
        self.assertEqual(del_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Product.objects.filter(id=self.product_a.id).exists())

    def test_creator_can_delete_own_product(self):
        """Creator can delete their own product."""
        self.client.force_authenticate(user=self.user_a)
        url = reverse("product-detail", args=[self.product_a.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Product.objects.filter(id=self.product_a.id).exists())

    def test_unauthenticated_cannot_create_product(self):
        """Unauthenticated user cannot create product."""
        url = reverse("product-list")
        response = self.client.post(url, {"name": "Craft", "price": "100.00"})
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_creator_my_products_endpoint(self):
        """Creator can view only their own products via /creator/my-products/."""
        self.client.force_authenticate(user=self.user_a)
        url = reverse("creator-my-products")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        product_names = [item["name"] for item in response.data]
        self.assertIn("Handcrafted Wooden Serving Board", product_names)
        self.assertNotIn("Handmade Ceramic Mug", product_names)

    # =========================================================================
    # D. SEARCH AND DISCOVERY TESTS
    # =========================================================================

    def test_search_products_by_keyword(self):
        """Search products by title, description or materials."""
        url = reverse("product-list")
        # Search for "walnut"
        res = self.client.get(url, {"search": "walnut"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data if isinstance(res.data, list) else res.data.get("results", [])
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "Handcrafted Wooden Serving Board")

        # Search for "stoneware"
        res_pottery = self.client.get(url, {"q": "stoneware"})
        results_pottery = res_pottery.data if isinstance(res_pottery.data, list) else res_pottery.data.get("results", [])
        self.assertEqual(len(results_pottery), 1)
        self.assertEqual(results_pottery[0]["name"], "Handmade Ceramic Mug")

    def test_filter_products_by_category(self):
        """Filter products by category slug."""
        url = reverse("product-list")
        res = self.client.get(url, {"category": "woodwork"})
        results = res.data if isinstance(res.data, list) else res.data.get("results", [])
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["category"], "woodwork")

    def test_filter_products_by_price_range(self):
        """Filter products by min_price and max_price."""
        url = reverse("product-list")
        # Products priced <= 400
        res = self.client.get(url, {"max_price": "400"})
        results = res.data if isinstance(res.data, list) else res.data.get("results", [])
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "Handmade Ceramic Mug")

    def test_filter_products_by_creator(self):
        """Filter products by creator ID."""
        url = reverse("product-list")
        res = self.client.get(url, {"creator": self.profile_a.id})
        results = res.data if isinstance(res.data, list) else res.data.get("results", [])
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["creator"], "Maren Holt")

    def test_filter_creators_by_search_and_location(self):
        """Search creators by name and filter by location."""
        url = reverse("creator-list")
        # Search "Priya"
        res_priya = self.client.get(url, {"search": "Priya"})
        results = res_priya.data if isinstance(res_priya.data, list) else res_priya.data.get("results", [])
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "Priya Nair")

        # Filter by location "Asheville"
        res_loc = self.client.get(url, {"location": "Asheville"})
        results_loc = res_loc.data if isinstance(res_loc.data, list) else res_loc.data.get("results", [])
        self.assertEqual(len(results_loc), 1)
        self.assertEqual(results_loc[0]["name"], "Maren Holt")

    # =========================================================================
    # E. IMAGES & CLOUDINARY UPLOAD TESTS
    # =========================================================================

    def test_image_upload_success(self):
        """Valid image upload returns a URL and public_id."""
        url = reverse("upload-image")
        image_file = create_test_image("test_craft.png")
        response = self.client.post(url, {"image": image_file}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("url", response.data)
        self.assertIn("public_id", response.data)

    def test_image_upload_reject_invalid_type(self):
        """Uploading non-image files is rejected with 400 Bad Request."""
        url = reverse("upload-image")
        bad_file = SimpleUploadedFile("script.py", b"print('hello')", content_type="text/x-python")
        response = self.client.post(url, {"image": bad_file}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_image_upload_reject_empty(self):
        """Uploading without file returns 400 Bad Request."""
        url = reverse("upload-image")
        response = self.client.post(url, {}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
