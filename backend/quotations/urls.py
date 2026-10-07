from django.urls import path
from django.urls import path
from .views import QuotationCreateView, RequirementQuotationsListView, QuotationAcceptRejectView

urlpatterns = [
    path('', QuotationCreateView.as_view(), name='quotation-create'),
    path('requirement/<int:requirement_id>/', RequirementQuotationsListView.as_view(), name='requirement-quotations'),
    path('<int:pk>/<str:action>/', QuotationAcceptRejectView.as_view(), name='quotation-decision'),
]
urlpatterns = []