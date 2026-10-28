
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status, views, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from rest_framework.response import Response

from .cloudinary_utils import upload_marketplace_image
from .models import Category, CreatorProfile, Product
from .permissions import IsOwnerOrReadOnly
from .serializers import (
    CategorySerializer,
    CreatorProfileSerializer,
    ProductSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    """List, retrieve, and manage craft categories."""

    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = "id"

    def get_object(self):
        lookup_value = self.kwargs.get(self.lookup_field)
        if lookup_value and str(lookup_value).isdigit():
            return get_object_or_404(Category, id=lookup_value)
        return get_object_or_404(Category, slug=lookup_value)


class CreatorProfileViewSet(viewsets.ModelViewSet):
    """Manage and search creator profiles."""

    queryset = (
        CreatorProfile.objects.all()
        .select_related("user")
        .prefetch_related("categories", "products")
    )
    serializer_class = CreatorProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()

        search_query = (
            self.request.query_params.get("search")
            or self.request.query_params.get("q")
        )
        if search_query:
            query = search_query.strip()
            queryset = queryset.filter(
                Q(name__icontains=query)
                | Q(specialty__icontains=query)
                | Q(bio__icontains=query)
                | Q(skills__icontains=query)
                | Q(location__icontains=query)
            )

        location = self.request.query_params.get("location")
        if location:
            queryset = queryset.filter(location__icontains=location.strip())

        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(
                Q(categories__slug=category.strip())
                | Q(categories__name__icontains=category.strip())
            ).distinct()

        ordering = self.request.query_params.get("ordering")
        allowed_ordering = [
            "name", "-name", "rating", "-rating",
            "created_at", "-created_at",
        ]
        if ordering in allowed_ordering:
            queryset = queryset.order_by(ordering)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(
        detail=False,
        methods=["get", "put", "patch"],
        permission_classes=[IsAuthenticated],
    )
    def me(self, request):
        """Get or update the logged-in user's creator profile."""
        profile, _ = CreatorProfile.objects.get_or_create(
            user=request.user,
            defaults={
                "name": request.user.get_full_name()
                or request.user.username
            },
        )

        if request.method in ["PUT", "PATCH"]:
            serializer = self.get_serializer(
                profile,
                data=request.data,
                partial=request.method == "PATCH",
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        return Response(self.get_serializer(profile).data)


class ProductViewSet(viewsets.ModelViewSet):
    """List, search, create, update, and delete craft products."""

    queryset = (
        Product.objects.filter(is_active=True)
        .select_related("creator", "category")
        .prefetch_related("images")
    )
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        return [IsOwnerOrReadOnly()]

    def get_queryset(self):
        queryset = super().get_queryset()

        if (
            self.action in ["retrieve", "update", "partial_update", "destroy"]
            and self.request.user.is_authenticated
        ):
            queryset = Product.objects.select_related(
                "creator", "category"
            ).prefetch_related("images")

        search_query = (
            self.request.query_params.get("search")
            or self.request.query_params.get("q")
        )
        if search_query:
            query = search_query.strip()
            queryset = queryset.filter(
                Q(name__icontains=query)
                | Q(description__icontains=query)
                | Q(materials__icontains=query)
                | Q(creator__name__icontains=query)
                | Q(creator__location__icontains=query)
            )

        category = self.request.query_params.get("category")
        if category and category.lower() != "all crafts":
            queryset = queryset.filter(
                Q(category__slug__iexact=category)
                | Q(category__name__icontains=category)
            )

        creator = self.request.query_params.get("creator")
        if creator:
            queryset = queryset.filter(creator_id=creator)

        location = self.request.query_params.get("location")
        if location:
            queryset = queryset.filter(
                creator__location__icontains=location
            )

        min_price = self.request.query_params.get("min_price")
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except (ValueError, TypeError):
                pass

        max_price = self.request.query_params.get("max_price")
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except (ValueError, TypeError):
                pass

        rating = self.request.query_params.get("rating")
        if rating:
            try:
                queryset = queryset.filter(rating__gte=float(rating))
            except (ValueError, TypeError):
                pass

        tag = self.request.query_params.get("tag")
        if tag:
            queryset = queryset.filter(tag__iexact=tag)

        ordering = (
            self.request.query_params.get("ordering")
            or self.request.query_params.get("sort")
        )
        if ordering:
            sort_map = {
                "featured": "-rating",
                "price-asc": "price",
                "price-desc": "-price",
                "rating": "-rating",
                "newest": "-created_at",
            }
            order_field = sort_map.get(ordering, ordering)
            allowed_fields = {
                "name", "-name", "price", "-price",
                "rating", "-rating", "created_at", "-created_at",
            }
            if order_field in allowed_fields:
                queryset = queryset.order_by(order_field)

        return queryset

    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise PermissionDenied(
                "Authentication required to create a product."
            )

        profile, _ = CreatorProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                "name": self.request.user.get_full_name()
                or self.request.user.username
            },
        )
        serializer.save(creator=profile)

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAuthenticated],
    )
    def my_crafts(self, request):
        """List products belonging to the logged-in creator."""
        try:
            profile = request.user.creator_profile
        except CreatorProfile.DoesNotExist:
            return Response([])

        products = Product.objects.filter(creator=profile)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)


class ImageUploadView(views.APIView):
    """Upload marketplace images using the configured image service."""

    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get("image") or request.FILES.get("file")

        if not file_obj:
            return Response(
                {"error": "No image file provided. Attach an 'image' file."},
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
        except Exception:
            return Response(
                {"error": "Image upload failed. Check the image service configuration and file."},
                status=status.HTTP_400_BAD_REQUEST,
            )
