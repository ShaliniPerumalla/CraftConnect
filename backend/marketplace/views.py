from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .models import CreatorProfile
from .serializers import CreatorProfileSerializer


class CreatorProfileListView(generics.ListAPIView):
    serializer_class = CreatorProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = CreatorProfile.objects.filter(
            creator__role="CREATOR"
        ).order_by("-created_at")

        category = self.request.query_params.get("category")
        location = self.request.query_params.get("location")

        if category:
            queryset = queryset.filter(
                category__icontains=category
            )

        if location:
            queryset = queryset.filter(
                location__icontains=location
            )

        return queryset


class CreatorProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = CreatorProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CreatorProfile.objects.filter(
            creator__role="CREATOR"
        )

    def perform_update(self, serializer):
        profile = self.get_object()

        if self.request.user.role != "CREATOR":
            raise PermissionDenied(
                "Only creators can update creator profiles."
            )

        if profile.creator != self.request.user:
            raise PermissionDenied(
                "You can only update your own creator profile."
            )

        serializer.save()


class MyCreatorProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CreatorProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        if self.request.user.role != "CREATOR":
            raise PermissionDenied(
                "Only creators can access a creator profile."
            )

        profile, created = CreatorProfile.objects.get_or_create(
            creator=self.request.user
        )

        return profile