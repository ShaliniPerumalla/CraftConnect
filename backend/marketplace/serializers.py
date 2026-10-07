from rest_framework import serializers
from .models import Category, CreatorProfile, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    count = serializers.IntegerField(source="pieces_count", read_only=True)

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "icon",
            "description",
            "image_url",
            "count",
            "created_at",
            "updated_at",
        ]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = [
            "id",
            "product",
            "image_url",
            "cloudinary_public_id",
            "caption",
            "is_primary",
            "order",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class ProductSerializer(serializers.ModelSerializer):
    creator = serializers.ReadOnlyField(source="creator.name")
    creatorId = serializers.ReadOnlyField(source="creator.id")
    creator_location = serializers.ReadOnlyField(source="creator.location")
    category = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    category_id = serializers.IntegerField(required=False, allow_null=True)
    category_slug = serializers.ReadOnlyField(source="category.slug")
    category_name = serializers.ReadOnlyField(source="category.name")
    reviews = serializers.IntegerField(source="reviews_count", read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "stock",
            "materials",
            "tag",
            "image",
            "cloudinary_public_id",
            "rating",
            "reviews",
            "category",
            "category_id",
            "category_slug",
            "category_name",
            "creator",
            "creatorId",
            "creator_location",
            "images",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "creator",
            "creatorId",
            "creator_location",
            "rating",
            "reviews",
            "created_at",
            "updated_at",
        ]

    def to_internal_value(self, data):
        # Extract category value before model field assignment
        category_raw = data.get("category") or data.get("category_id")
        ret = super().to_internal_value(data)

        if category_raw:
            cat = None
            if isinstance(category_raw, int) or (isinstance(category_raw, str) and category_raw.isdigit()):
                cat = Category.objects.filter(id=int(category_raw)).first()
            if not cat and isinstance(category_raw, str):
                cat = Category.objects.filter(slug__iexact=category_raw.strip()).first() or Category.objects.filter(name__iexact=category_raw.strip()).first()
            if cat:
                ret["category"] = cat

        return ret

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Ensure category representation matches string slug for frontend convenience
        if instance.category:
            data["category"] = instance.category.slug
            data["category_id"] = instance.category.id
        else:
            data["category"] = ""
            data["category_id"] = None
        return data

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Title/name is required.")
        return value.strip()

    def validate_price(self, value):
        if value is None or value <= 0:
            raise serializers.ValidationError("Price must be greater than 0.")
        return value

    def validate_stock(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Stock cannot be negative.")
        return value


class CreatorProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="user.username")
    email = serializers.ReadOnlyField(source="user.email")
    products = serializers.IntegerField(source="products_count", read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Category.objects.all(),
        write_only=True,
        source="categories",
        required=False
    )
    pieces = ProductSerializer(source="products", many=True, read_only=True)

    class Meta:
        model = CreatorProfile
        fields = [
            "id",
            "user",
            "username",
            "email",
            "name",
            "specialty",
            "bio",
            "skills",
            "location",
            "avatar",
            "cover",
            "rating",
            "reviews_count",
            "is_verified",
            "products",
            "categories",
            "category_ids",
            "pieces",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "username",
            "email",
            "rating",
            "reviews_count",
            "products",
            "created_at",
            "updated_at",
        ]

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Creator name cannot be empty.")
        return value.strip()
