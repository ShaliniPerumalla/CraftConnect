import uuid
from django.conf import settings
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """
    Marketplace Category (e.g., Woodwork, Pottery, Jewelry, Textiles, Wall Art, etc.)
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    icon = models.CharField(max_length=50, blank=True, default="Package")
    description = models.TextField(blank=True)
    image_url = models.URLField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def pieces_count(self):
        return self.products.filter(is_active=True).count()

    def __str__(self):
        return self.name


class CreatorProfile(models.Model):
    """
    Creator Profile linked to the authenticated user.
    Stores professional and storefront details for independent makers.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="creator_profile"
    )
    name = models.CharField(max_length=150)
    specialty = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    skills = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=150, blank=True)
    avatar = models.URLField(max_length=500, blank=True)
    cover = models.URLField(max_length=500, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    reviews_count = models.PositiveIntegerField(default=0)
    is_verified = models.BooleanField(default=True)
    categories = models.ManyToManyField(
        Category,
        related_name="creators",
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    @property
    def products_count(self):
        return self.products.filter(is_active=True).count()

    def __str__(self):
        return self.name or f"Creator ({self.user.username})"


class Product(models.Model):
    """
    Handcrafted product or custom service listing created by an authenticated creator.
    """
    TAG_CHOICES = [
        ("New", "New"),
        ("Bestseller", "Bestseller"),
        ("Limited", "Limited"),
    ]

    creator = models.ForeignKey(
        CreatorProfile,
        on_delete=models.CASCADE,
        related_name="products"
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="products"
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=10)
    materials = models.CharField(max_length=255, blank=True)
    tag = models.CharField(max_length=50, blank=True, null=True)
    image = models.URLField(max_length=500, blank=True)
    cloudinary_public_id = models.CharField(max_length=255, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    reviews_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} by {self.creator.name}"


class ProductImage(models.Model):
    """
    Additional Cloudinary / media images for a product or custom craft.
    Stores Cloudinary URL and public ID instead of raw image binaries.
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images"
    )
    image_url = models.URLField(max_length=500)
    cloudinary_public_id = models.CharField(max_length=255, blank=True)
    caption = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-is_primary", "created_at"]

    def __str__(self):
        return f"Image for {self.product.name} ({self.id})"
