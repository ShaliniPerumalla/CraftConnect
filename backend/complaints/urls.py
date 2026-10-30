from django.urls import path
from .views import (
    ComplaintListCreateView,
    ComplaintDetailUpdateView,
    ComplaintResolveView,
    ComplaintStatisticsView,
)

urlpatterns = [
    path('', ComplaintListCreateView.as_view(), name='complaint-list-create'),
    path('statistics/', ComplaintStatisticsView.as_view(), name='complaint-statistics'),
    path('<str:pk>/', ComplaintDetailUpdateView.as_view(), name='complaint-detail-update'),
    path('<str:pk>/resolve/', ComplaintResolveView.as_view(), name='complaint-resolve'),
]