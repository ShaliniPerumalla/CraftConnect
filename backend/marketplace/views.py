from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, status, views, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .cloudinary_utils import upload_marketplace_image
from .models import Category, CreatorProfile, Product, ProductImage
from .permissions import IsCreatorOrReadOnly, IsOwnerOrReadOnly
from .serializers import (
    CategorySerializer,
    CreatorProfileSerializer,
    ProductImageSerializer,
    ProductSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for listing and creating craft categories.
    Publicly readable, authenticated write.
    """
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = "id"

    def get_object(self):
        # Support lookup by id or slug
        lookup_url_kwarg = self.lookup_field
        lookup_value = self.kwargs.get(lookup_url_kwarg)
        if lookup_value and str(lookup_value).isdigit():
            return get_object_or_404(Category, id=lookup_value)
        return get_object_or_404(Category, slug=lookup_value)


class CreatorProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint for creator profiles:
    - Public: List and retrieve creators (with search, category, and location filtering).
    - Authenticated: Create own profile.
    - Owner only: Update own profile.
    """
    queryset = CreatorProfile.objects.all().select_related("user").prefetch_related("categories", "products")
    serializer_class = CreatorProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Search filter (name, specialty, bio, skills, location)
        search_query = self.request.query_params.get("search") or self.request.query_params.get("q")
        if search_query:
            query = search_query.strip()
            queryset = queryset.filter(
                Q(name__icontains=query)
                | Q(specialty__icontains=query)
                | Q(bio__icontains=query)
                | Q(skills__icontains=query)
                | Q(location__icontains=query)
            )

        # Location filter
        location = self.request.query_params.get("location")
        if location:
            queryset = queryset.filter(location__icontains=location.strip())

        # Category filter (by slug or name)
        category_param = self.request.query_params.get("category")
        if category_param:
            queryset = queryset.filter(
                Q(categories__slug=category_param.strip())
                | Q(categories__name__icontains=category_param.strip())
            ).distinct()

        # Ordering
        ordering = self.request.query_params.get("ordering")
        if ordering:
            if ordering in ["name", "-name", "rating", "-rating", "created_at", "-created_at"]:
                queryset = queryset.order_by(ordering)

        return queryset

    def perform_create(self, serializer):
        # Link profile to the authenticated user
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get", "put", "patch"], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Endpoint to retrieve or update the authenticated user's creator profile:
        GET /api/marketplace/creators/me/
        PUT/PATCH /api/marketplace/creators/me/
        """
        profile, created = CreatorProfile.objects.get_or_create(
            user=request.user,
            defaults={"name": request.user.get_full_name() or request.user.username}
        )

        if request.method in ["PUT", "PATCH"]:
            partial = request.method == "PATCH"
            serializer = self.get_serializer(profile, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        serializer = self.get_serializer(profile)
        return Response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint for products/crafts:
    - Public: List & Retrieve with filtering (search, category, price, rating, location).
    - Authenticated creator: Create product.
    - Owner only: Update & Delete product.
    """
    queryset = Product.objects.filter(is_active=True).select_related("creator", "category").prefetch_related("images")
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        return [IsOwnerOrReadOnly()]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Include inactive products if requested by the owner
        if self.action in ["retrieve", "update", "partial_update", "destroy"] and self.request.user.is_authenticated:
            queryset = Product.objects.select_related("creator", "category").prefetch_related("images")

        # Search across name, description, materials, creator name, location
        search_query = self.request.query_params.get("search") or self.request.query_params.get("q")
        if search_query:
            query = search_query.strip()
            queryset = queryset.filter(
                Q(name__icontains=query)
                | Q(description__icontains=query)
                | Q(materials__icontains=query)
                | Q(creator__name__icontains=query)
                | Q(creator__location__icontains=query)
            )

        # Category filter (by id, slug, or name)
        category_param = self.request.query_params.get("category")
        if category_param and category_param.lower() != "all crafts":
            queryset = queryset.filter(
                Q(category__slug__iexact=category_param)
                | Q(category__name__icontains=category_param)
            )

        # Creator filter
        creator_param = self.request.query_params.get("creator")
        if creator_param:
            queryset = queryset.filter(creator_id=creator_param)

        # Location filter
        location_param = self.request.query_params.get("location")
        if location_param:
            queryset = queryset.filter(creator__location__icontains=location_param)

        # Price range filter
        min_price = self.request.query_params.get("min_price")
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                pass

        max_price = self.request.query_params.get("max_price")
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass

        # Rating filter
        rating_param = self.request.query_params.get("rating")
        if rating_param:
            try:
                queryset = queryset.filter(rating__gte=float(rating_param))
            except ValueError:
                pass

        # Tag filter
        tag_param = self.request.query_params.get("tag")
        if tag_param:
            queryset = queryset.filter(tag__iexact=tag_param)

        # Ordering
        ordering = self.request.query_params.get("ordering") or self.request.query_params.get("sort")
        if ordering:
            sort_map = {
                "featured": "-rating",
                "price-asc": "price",
                "price-desc": "-price",
                "rating": "-rating",
                "newest": "-created_at",
            }
            order_field = sort_map.get(ordering, ordering)
            queryset = queryset.order_by(order_field)

        return queryset

    def perform_create(self, serializer):
        if not self.request.user or not self.request.user.is_authenticated:
            raise PermissionDenied("Authentication required to create a product.")

        if not hasattr(self.request.user, "creator_profile"):
            profile, _ = CreatorProfile.objects.get_or_create(
                user=self.request.user,
                defaults={"name": self.request.user.get_full_name() or self.request.user.username}
            )
        else:
            profile = self.request.user.creator_profile

        serializer.save(creator=profile)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def my_crafts(self, request):
        """
        List all products belonging to the logged-in creator.
        """
        if not hasattr(request.user, "creator_profile"):
            return Response([])

        products = Product.objects.filter(creator=request.user.creator_profile)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)


class ImageUploadView(views.APIView):
    """
    API endpoint for uploading marketplace images.
    Integrates with Cloudinary (or local storage fallback).
    Stores Cloudinary URL and public ID.
    Validates file MIME type and size limit (<= 5MB).
    """
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get("image") or request.FILES.get("file")
        if not file_obj:
            return Response(
                {"error": "No image file provided. Please attach an 'image' file."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = upload_marketplace_image(file_obj)
            return Response(
                {
                    "message": "Image uploaded successfully.",
                    "url": result["url"],
                    "public_id": result["public_id"],
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as error:
            return Response(
                {"error": str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )
