from django.urls import path
from .views import (
    ReviewListCreateView,
    CreatorReviewSummaryView,
    OrderReviewDetailView,
)

urlpatterns = [
    path('', ReviewListCreateView.as_view(), name='review-list-create'),
    path('creator/<int:creator_id>/summary/', CreatorReviewSummaryView.as_view(), name='creator-review-summary'),
    path('order/<str:order_id>/', OrderReviewDetailView.as_view(), name='order-review-detail'),
]