from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Requirement
from .serializers import RequirementSerializer


class RequirementListCreateView(generics.ListCreateAPIView):

    serializer_class = RequirementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "CUSTOMER":
            return Requirement.objects.filter(
                customer=user
            ).order_by("-created_at")

        if user.role in ["CREATOR", "ADMIN"]:
            return Requirement.objects.all().order_by("-created_at")

        return Requirement.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role != "CUSTOMER":
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "Only customers can create requirements."
            )

        serializer.save(
            customer=self.request.user
        )
class RequirementDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = RequirementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "CUSTOMER":
            return Requirement.objects.filter(
                customer=user
            )

        if user.role in ["CREATOR", "ADMIN"]:
            return Requirement.objects.all()

        return Requirement.objects.none()

    def perform_update(self, serializer):
        requirement = self.get_object()

        if (
            self.request.user.role == "CUSTOMER"
            and requirement.status != "OPEN"
        ):
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "Only open requirements can be edited."
            )

        if self.request.user.role not in ["CUSTOMER", "ADMIN"]:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "You do not have permission to edit this requirement."
            )

        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role == "CUSTOMER":
            if instance.status != "OPEN":
                from rest_framework.exceptions import PermissionDenied

                raise PermissionDenied(
                    "Only open requirements can be cancelled."
                )

            instance.status = "CANCELLED"
            instance.save()

        elif self.request.user.role == "ADMIN":
            instance.delete()

        else:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "You do not have permission to cancel this requirement."
            )