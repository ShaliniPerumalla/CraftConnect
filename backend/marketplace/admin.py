from django.contrib import admin
from .models import Category, CreatorProfile, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "icon", "pieces_count", "created_at"]
    search_fields = ["name", "description"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(CreatorProfile)
class CreatorProfileAdmin(admin.ModelAdmin):
    list_display = ["name", "user", "specialty", "location", "rating", "products_count", "is_verified"]
    search_fields = ["name", "user__username", "specialty", "location", "skills"]
    list_filter = ["is_verified", "rating"]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "creator", "category", "price", "stock", "tag", "rating", "is_active"]
    search_fields = ["name", "description", "materials", "creator__name"]
    list_filter = ["category", "tag", "is_active"]
    inlines = [ProductImageInline]


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ["product", "is_primary", "order", "image_url", "cloudinary_public_id"]
    list_filter = ["is_primary"]
