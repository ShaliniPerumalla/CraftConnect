from django.urls import path

from .views import (
    CreatorProfileListView,
    CreatorProfileDetailView,
    MyCreatorProfileView,
)


urlpatterns = [
    path(
        "",
        CreatorProfileListView.as_view(),
        name="creator-list",
    ),

    path(
        "my-profile/",
        MyCreatorProfileView.as_view(),
        name="my-creator-profile",
    ),

    path(
        "<int:pk>/",
        CreatorProfileDetailView.as_view(),
        name="creator-detail",
    ),
]