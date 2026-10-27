
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet,
    CreatorProfileViewSet,
    ImageUploadView,
    ProductViewSet,
)

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"creators", CreatorProfileViewSet, basename="creator")
router.register(r"products", ProductViewSet, basename="product")

urlpatterns = [
    # Categories, creators, and products
    path("", include(router.urls)),

    # Image upload endpoint
    path("upload-image/", ImageUploadView.as_view(), name="upload-image"),

    # Creator self-service endpoints
    path(
        "creator-profile/me/",
        CreatorProfileViewSet.as_view({
            "get": "me",
            "put": "me",
            "patch": "me",
        }),
        name="creator-me",
    ),
    path(
        "creator/my-products/",
        ProductViewSet.as_view({"get": "my_crafts"}),
        name="creator-my-products",
    ),
]
