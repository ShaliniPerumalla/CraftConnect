<<<<<<< HEAD
=======

"""
URL configuration for config project.
"""

>>>>>>> origin/develop
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Admin Interface
    path('admin/', admin.site.urls),

<<<<<<< HEAD
    # JWT Authentication Endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Application Modules
    path('api/auth/', include('accounts.urls')),
    path('api/marketplace/', include('marketplace.urls')),
    path('api/requirements/', include('requirements_app.urls')),
    path('api/quotations/', include('quotations.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/communication/', include('communication.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/complaints/', include('complaints.urls')),
]
=======
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
]
>>>>>>> origin/develop
