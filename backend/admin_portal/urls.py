from django.urls import path
from .views import (
    PlatformStatisticsView,
    AdminUsersListView,
    AdminCreatorsListView,
    AdminOrdersListView,
    AdminRequirementsListView,
    AdminQuotationsListView,
    AdminComplaintsListView,
    AdminReviewsListView,
    AdminReviewDeleteView,
)

urlpatterns = [
    path('statistics/', PlatformStatisticsView.as_view(), name='admin-statistics'),
    path('users/', AdminUsersListView.as_view(), name='admin-users-list'),
    path('users/<int:pk>/', AdminUsersListView.as_view(), name='admin-user-update'),
    path('creators/', AdminCreatorsListView.as_view(), name='admin-creators-list'),
    path('creators/<int:pk>/verify/', AdminCreatorsListView.as_view(), name='admin-creator-verify'),
    path('orders/', AdminOrdersListView.as_view(), name='admin-orders-list'),
    path('requirements/', AdminRequirementsListView.as_view(), name='admin-requirements-list'),
    path('quotations/', AdminQuotationsListView.as_view(), name='admin-quotations-list'),
    path('complaints/', AdminComplaintsListView.as_view(), name='admin-complaints-list'),
    path('reviews/', AdminReviewsListView.as_view(), name='admin-reviews-list'),
    path('reviews/<int:pk>/', AdminReviewDeleteView.as_view(), name='admin-review-delete'),
]
