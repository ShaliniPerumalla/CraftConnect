from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Requirement
from .serializers import RequirementSerializer

class RequirementListCreateView(generics.ListCreateAPIView):
    serializer_class = RequirementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Creators can view open and quoted requirements available to bid on
        if getattr(user, 'role', None) == 'Creator' or getattr(user, 'is_creator', False):
            return Requirement.objects.filter(status__in=['open', 'quoted'])
        # Customers only see their own custom requirements
        return Requirement.objects.filter(customer=user)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

class RequirementDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RequirementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'role', None) == 'Creator' or getattr(user, 'is_creator', False):
            return Requirement.objects.all()
        return Requirement.objects.filter(customer=user)

    def perform_destroy(self, instance):
        if instance.status == 'open':
            instance.status = 'cancelled'
            instance.save()
            return Response({"message": "Requirement successfully cancelled."}, status=status.HTTP_200_OK)
        return Response({"error": "Cannot cancel this requirement at its current stage."}, status=status.HTTP_400_BAD_REQUEST)
# Create your views here.
