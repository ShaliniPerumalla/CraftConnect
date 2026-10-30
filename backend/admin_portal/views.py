from django.contrib.auth import get_user_model
from django.db.models import Sum, Avg, Count
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .permissions import IsPlatformAdmin
from marketplace.models import CreatorProfile, Product
from requirements_app.models import Requirement
from quotations.models import Quotation
from orders.models import Order
from complaints.models import Complaint
from reviews.models import Review
from orders.serializers import OrderSerializer
from complaints.serializers import ComplaintSerializer
from reviews.serializers import ReviewSerializer
from quotations.serializers import QuotationSerializer
from requirements_app.serializers import RequirementSerializer

User = get_user_model()

class PlatformStatisticsView(APIView):
    permission_classes = [IsPlatformAdmin]

    def get(self, request):
        total_users = User.objects.count()
        total_creators = CreatorProfile.objects.count()
        total_orders = Order.objects.count()
        pending_orders = Order.objects.exclude(status__in=['delivered', 'cancelled']).count()
        completed_orders = Order.objects.filter(status='delivered').count()

        revenue_agg = Order.objects.filter(status='delivered').aggregate(total=Sum('total_amount'))
        total_revenue = float(revenue_agg['total'] or 0.0)

        total_requirements = Requirement.objects.count()
        open_requirements = Requirement.objects.filter(status__in=['open', 'quoted']).count()

        total_complaints = Complaint.objects.count()
        pending_complaints = Complaint.objects.filter(status__in=['Pending', 'In Review']).count()

        total_reviews = Review.objects.count()
        avg_rating = Review.objects.aggregate(avg=Avg('rating'))['avg'] or 5.0

        return Response({
            "users": total_users,
            "creators": total_creators,
            "orders": total_orders,
            "pending_orders": pending_orders,
            "completed_orders": completed_orders,
            "revenue": total_revenue,
            "requirements": total_requirements,
            "open_requirements": open_requirements,
            "complaints": total_complaints,
            "pending_complaints": pending_complaints,
            "reviews": total_reviews,
            "rating": round(avg_rating, 2)
        }, status=status.HTTP_200_OK)


class AdminUsersListView(APIView):
    permission_classes = [IsPlatformAdmin]

    def get(self, request):
        users = User.objects.all().order_by('-date_joined')
        data = []
        for u in users:
            role = 'creator' if (hasattr(u, 'creator_profile') or getattr(u, 'is_creator', False)) else ('admin' if (u.is_staff or u.is_superuser) else 'customer')
            data.append({
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "name": f"{u.first_name} {u.last_name}".strip() or u.username,
                "role": role,
                "is_active": u.is_active,
                "date_joined": u.date_joined,
            })
        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            if 'is_active' in request.data:
                user.is_active = bool(request.data['is_active'])
            if 'is_staff' in request.data:
                user.is_staff = bool(request.data['is_staff'])
            user.save()
            return Response({"message": "User updated successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class AdminCreatorsListView(APIView):
    permission_classes = [IsPlatformAdmin]

    def get(self, request):
        creators = CreatorProfile.objects.all().select_related('user')
        data = []
        for c in creators:
            data.append({
                "id": c.id,
                "userId": c.user_id,
                "name": c.name or c.user.username,
                "email": c.user.email,
                "specialty": c.specialty,
                "rating": float(c.rating),
                "reviews_count": c.reviews_count,
                "is_verified": c.is_verified,
                "created_at": c.created_at,
            })
        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        try:
            creator = CreatorProfile.objects.get(pk=pk)
            if 'is_verified' in request.data:
                creator.is_verified = bool(request.data['is_verified'])
                creator.save()
            return Response({"message": "Creator verification updated."}, status=status.HTTP_200_OK)
        except CreatorProfile.DoesNotExist:
            return Response({"error": "Creator not found."}, status=status.HTTP_404_NOT_FOUND)


class AdminOrdersListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsPlatformAdmin]
    queryset = Order.objects.all().select_related('customer', 'creator').prefetch_related('items')


class AdminRequirementsListView(generics.ListAPIView):
    serializer_class = RequirementSerializer
    permission_classes = [IsPlatformAdmin]
    queryset = Requirement.objects.all().select_related('customer')


class AdminQuotationsListView(generics.ListAPIView):
    serializer_class = QuotationSerializer
    permission_classes = [IsPlatformAdmin]
    queryset = Quotation.objects.all().select_related('requirement', 'creator')


class AdminComplaintsListView(generics.ListAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [IsPlatformAdmin]
    queryset = Complaint.objects.all().select_related('user', 'order', 'resolved_by')


class AdminReviewsListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsPlatformAdmin]
    queryset = Review.objects.all().select_related('customer', 'creator', 'order')


class AdminReviewDeleteView(generics.DestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsPlatformAdmin]
    queryset = Review.objects.all()
