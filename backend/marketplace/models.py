from django.conf import settings
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    id_slug = models.SlugField(max_length=100, unique=True, blank=True)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    icon = models.CharField(max_length=50, blank=True, default="")
    description = models.TextField(blank=True, default="")
    image_url = models.URLField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.id_slug:
            self.id_slug = self.slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class CreatorProfile(models.Model):
    creator = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="creator_profile",
    )

    name = models.CharField(max_length=150, blank=True, default="")
    business_name = models.CharField(max_length=150, blank=True, default="")
    bio = models.TextField(blank=True, default="")
    category = models.CharField(max_length=100, blank=True, default="")
    location = models.CharField(max_length=200, blank=True, default="")
    phone = models.CharField(max_length=20, blank=True, default="")
    specialty = models.CharField(max_length=200, blank=True, default="")
    skills = models.TextField(blank=True, default="")
    avatar = models.URLField(blank=True, default="")
    cover = models.URLField(blank=True, default="")
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    profile_image = models.ImageField(upload_to="creator_profiles/", null=True, blank=True)
    categories = models.ManyToManyField(Category, blank=True, related_name="creators")
    is_verified = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def products_count(self):
        return self.products.count()

    def __str__(self):
        return self.business_name or self.name or self.creator.name


class Product(models.Model):
    creator = models.ForeignKey(
        CreatorProfile,
        on_delete=models.CASCADE,
        related_name="products",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="products",
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, default="")
    materials = models.CharField(max_length=200, blank=True, default="")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    tag = models.CharField(max_length=50, blank=True, default="")
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    reviews_count = models.PositiveIntegerField(default=0)
    image = models.URLField(blank=True, default="")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images",
    )
    image_url = models.URLField(blank=True, default="")
    cloudinary_public_id = models.CharField(max_length=200, blank=True, default="")
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.product.name} image {self.id}"