from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Quotation
from .serializers import QuotationSerializer
from requirements_app.models import Requirement

class QuotationCreateView(generics.CreateAPIView):
    serializer_class = QuotationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        req = serializer.validated_data['requirement']
        serializer.save(creator=self.request.user)
        if req.status == 'open':
            req.status = 'quoted'
            req.save()

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
