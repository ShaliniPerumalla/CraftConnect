from django.shortcuts import render
from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Requirement
from .serializers import RequirementSerializer

class RequirementListCreateView(generics.ListCreateAPIView):
    serializer_class = RequirementSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user
        role_param = (self.request.query_params.get('role') or '').lower()
        view_param = (self.request.query_params.get('view') or '').lower()
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')

        # Check if creator requesting marketplace view or public marketplace
        is_creator = (
            role_param == 'creator'
            or view_param in ['marketplace', 'creator', 'open']
            or not user.is_authenticated
            or str(getattr(user, 'role', '')).lower() == 'creator'
            or getattr(user, 'is_creator', False)
        )

        if is_creator:
            qs = Requirement.objects.filter(status__in=['open', 'quoted'])
        else:
            # Customers only see their own custom requirements
            qs = Requirement.objects.filter(customer=user)

        if category and category != 'All':
            qs = qs.filter(category__iexact=category)

        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(category__icontains=search) |
                Q(delivery_address__icontains=search)
            )

        return qs

    def perform_create(self, serializer):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        if self.request.user.is_authenticated:
            customer = self.request.user
        else:
            customer = User.objects.get_or_create(
                username='customer_demo',
                defaults={'email': 'customer@makermatch.internal'}
            )[0]
        serializer.save(customer=customer)

class RequirementDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RequirementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role_param = (self.request.query_params.get('role') or '').lower()
        view_param = (self.request.query_params.get('view') or '').lower()

        is_creator = (
            role_param == 'creator'
            or view_param in ['marketplace', 'creator', 'open']
            or str(getattr(user, 'role', '')).lower() == 'creator'
            or getattr(user, 'is_creator', False)
        )

        if is_creator:
            return Requirement.objects.all()
        return Requirement.objects.filter(customer=user)

    def perform_update(self, serializer):
        instance = self.get_object()
        # Only customer can update, and only while editable ('open')
        if instance.status != 'open':
            raise ValidationError({"error": "Cannot edit a requirement once quotations have been accepted or processed."})
        serializer.save()

    def perform_destroy(self, instance):
        if instance.status == 'open':
            instance.status = 'cancelled'
            instance.save()
            return Response({"message": "Requirement successfully cancelled."}, status=status.HTTP_200_OK)
        return Response({"error": "Cannot cancel this requirement at its current stage."}, status=status.HTTP_400_BAD_REQUEST)
