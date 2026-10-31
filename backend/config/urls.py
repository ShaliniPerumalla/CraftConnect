
"""
URL configuration for config project.
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Admin Interface
    path('admin/', admin.site.urls),

    # Authentication
    path("api/auth/", include("accounts.urls")),

    # Marketplace and crafts
    path("api/marketplace/", include("marketplace.urls")),

    # Requirements and quotations
    path("api/requirements/", include("requirements_app.urls")),
    path("api/quotations/", include("quotations.urls")),

    # Other MakerMatch modules
    path("api/orders/", include("orders.urls")),
    path("api/communication/", include("communication.urls")),
    path("api/reviews/", include("reviews.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/complaints/", include("complaints.urls")),
    path("api/admin/", include("admin_portal.urls")),
]
