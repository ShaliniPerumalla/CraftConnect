from django.urls import path
from .views import RequirementListCreateView, RequirementDetailView

urlpatterns = [
    path('', RequirementListCreateView.as_view(), name='requirement-list-create'),
    path('<int:pk>/', RequirementDetailView.as_view(), name='requirement-detail'),
]