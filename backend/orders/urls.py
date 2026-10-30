from django.urls import path
from .views import (
    OrderListCreateView,
    OrderDetailView,
    OrderStatusUpdateView,
    OrderDesignUploadView,
    OrderDesignReviewView,
    OrderCancelView,
)

urlpatterns = [
    path('', OrderListCreateView.as_view(), name='order-list-create'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('<int:pk>/status/', OrderStatusUpdateView.as_view(), name='order-status-update'),
    path('<int:pk>/design-upload/', OrderDesignUploadView.as_view(), name='order-design-upload'),
    path('<int:pk>/design-review/', OrderDesignReviewView.as_view(), name='order-design-review'),
    path('<int:pk>/cancel/', OrderCancelView.as_view(), name='order-cancel'),
]