from django.shortcuts import render
from django.db import models
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Quotation
from .serializers import QuotationSerializer
from requirements_app.models import Requirement

class QuotationListCreateView(generics.ListCreateAPIView):
    serializer_class = QuotationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user
        req_id = self.request.query_params.get('requirement') or self.request.query_params.get('requirement_id')
        role_param = (self.request.query_params.get('role') or '').lower()
        is_creator = (
            role_param == 'creator'
            or not user.is_authenticated
            or str(getattr(user, 'role', '')).lower() == 'creator'
            or getattr(user, 'is_creator', False)
        )

        qs = Quotation.objects.all()
        if req_id:
            qs = qs.filter(requirement_id=req_id)
            if user.is_authenticated and not is_creator:
                qs = qs.filter(requirement__customer=user)
            return qs

        if not user.is_authenticated or is_creator:
            return qs.filter(creator=user) if user.is_authenticated else qs
        return qs.filter(requirement__customer=user)

    def perform_create(self, serializer):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        req = serializer.validated_data['requirement']
        if self.request.user.is_authenticated:
            creator = self.request.user
        else:
            creator = User.objects.get_or_create(
                username='artisan_demo',
                defaults={'email': 'artisan@makermatch.internal'}
            )[0]

        serializer.save(creator=creator)
        if req.status == 'open':
            req.status = 'quoted'
            req.save()

class QuotationDetailUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuotationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Creator can manage their quotation; customer of requirement can view
        return Quotation.objects.filter(
            models.Q(creator=user) | models.Q(requirement__customer=user)
        )

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.creator != self.request.user:
            raise ValidationError({"error": "You can only update your own quotation."})
        if instance.status != 'pending':
            raise ValidationError({"error": "Cannot modify quotation once accepted or rejected."})
        serializer.save()

    def perform_destroy(self, instance):
        if instance.creator != self.request.user:
            return Response({"error": "You can only cancel your own quotation."}, status=status.HTTP_403_FORBIDDEN)
        if instance.status != 'pending':
            return Response({"error": "Cannot withdraw quotation once accepted or rejected."}, status=status.HTTP_400_BAD_REQUEST)
        instance.delete()
        return Response({"message": "Quotation withdrawn successfully."}, status=status.HTTP_200_OK)

class RequirementQuotationsListView(generics.ListAPIView):
    serializer_class = QuotationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        req_id = self.kwargs['requirement_id']
        req = Requirement.objects.get(id=req_id)
        if req.customer == self.request.user:
            return Quotation.objects.filter(requirement_id=req_id)
        return Quotation.objects.filter(requirement_id=req_id, creator=self.request.user)

class QuotationAcceptRejectView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk, action):
        try:
            quotation = Quotation.objects.get(pk=pk, requirement__customer=request.user)
        except Quotation.DoesNotExist:
            return Response({"error": "Quotation not found or you are not authorized."}, status=status.HTTP_404_NOT_FOUND)

        if action == 'accept':
            quotation.status = 'accepted'
            quotation.save()
            quotation.requirement.status = 'accepted'
            quotation.requirement.save()

            # Reject all other competing quotes on this requirement
            Quotation.objects.filter(requirement=quotation.requirement).exclude(id=quotation.id).update(status='rejected')
            return Response({"message": "Quotation accepted successfully."}, status=status.HTTP_200_OK)

        elif action == 'reject':
            quotation.status = 'rejected'
            quotation.save()
            return Response({"message": "Quotation rejected."}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid action parameter. Must be 'accept' or 'reject'."}, status=status.HTTP_400_BAD_REQUEST)
# Create your views here.
