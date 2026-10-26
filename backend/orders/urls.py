from django.urls import path

from .views import (
    AdminComplaintListView,
    AdminComplaintResolveView,
    AdminPlatformStatsView,
    AdminUserListView,
    ArtisanReviewListView,
    ComplaintCreateListView,
    MarkNotificationAsReadView,
    MyComplaintListView,
    NotificationListView,
    OrderDetailView,
    OrderListCreateView,
    OrderStatusUpdateView,
    ReviewCreateListView,
)

urlpatterns = [
    # Orders
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('orders/<int:pk>/update-status/', OrderStatusUpdateView.as_view(), name='order-update-status'),

    # Reviews
    path('reviews/', ReviewCreateListView.as_view(), name='review-create-list'),
    path('reviews/artisan/<int:artisan_id>/', ArtisanReviewListView.as_view(), name='artisan-review-list'),

    # Complaints
    path('complaints/', ComplaintCreateListView.as_view(), name='complaint-create-list'),
    path('complaints/my-complaints/', MyComplaintListView.as_view(), name='my-complaints'),

    # Notifications
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/mark-read/', MarkNotificationAsReadView.as_view(), name='notification-mark-read'),

    # Admin
    path('admin/complaints/', AdminComplaintListView.as_view(), name='admin-complaint-list'),
    path('admin/complaints/<int:pk>/resolve/', AdminComplaintResolveView.as_view(), name='admin-complaint-resolve'),
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/stats/', AdminPlatformStatsView.as_view(), name='admin-platform-stats'),
]