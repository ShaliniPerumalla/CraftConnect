from django.urls import path
from .views import (
    QuotationListCreateView,
    QuotationDetailUpdateView,
    RequirementQuotationsListView,
    QuotationAcceptRejectView,
)

urlpatterns = [
    path('', QuotationListCreateView.as_view(), name='quotation-list-create'),
    path('<int:pk>/', QuotationDetailUpdateView.as_view(), name='quotation-detail-update'),
    path('requirement/<int:requirement_id>/', RequirementQuotationsListView.as_view(), name='requirement-quotations'),
    path('<int:pk>/<str:action>/', QuotationAcceptRejectView.as_view(), name='quotation-decision'),
]
