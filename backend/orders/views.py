from django.contrib.auth import get_user_model
from django.db.models import Avg, Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Complaint, Notification, Order, Review
from .serializers import (
    AdminPlatformStatsSerializer,
    ComplaintResolveSerializer,
    ComplaintSerializer,
    NotificationSerializer,
    OrderSerializer,
    OrderStatusUpdateSerializer,
    ReviewSerializer,
    UserManagementSerializer,
)

User = get_user_model()


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.buyer == request.user or obj.artisan == request.user


class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Order.objects.filter(Q(buyer=user) | Q(artisan=user)).select_related('buyer', 'artisan', 'quotation')

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)


class OrderDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        user = self.request.user
        return Order.objects.filter(Q(buyer=user) | Q(artisan=user)).select_related('buyer', 'artisan', 'quotation')


class OrderStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        if request.user != order.artisan and not request.user.is_staff:
            return Response({'detail': 'Only the assigned artisan can update this order status.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = OrderStatusUpdateSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewCreateListView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.select_related('order', 'reviewer', 'artisan')

    def perform_create(self, serializer):
        order_id = self.request.data.get('order')
        order = get_object_or_404(Order, pk=order_id)

        if order.buyer != self.request.user:
            raise permissions.PermissionDenied('Only the buyer can submit a review for this order.')
        if Review.objects.filter(order=order).exists():
            raise permissions.PermissionDenied('A review already exists for this order.')
        if order.status not in {'delivered', 'completed'}:
            raise permissions.PermissionDenied('You can only review orders that have been delivered.')

        serializer.save(reviewer=self.request.user, artisan=order.artisan)


class ArtisanReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        artisan_id = self.kwargs.get('artisan_id')
        return Review.objects.filter(artisan_id=artisan_id).select_related('order', 'reviewer', 'artisan')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        average_rating = queryset.aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0
        payload = {
            'count': queryset.count(),
            'average_rating': round(float(average_rating), 2),
            'results': serializer.data,
        }
        return Response(payload)


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)


class MarkNotificationAsReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk, recipient=request.user)
        notification.is_read = True
        notification.save(update_fields=['is_read'])
        return Response(NotificationSerializer(notification).data, status=status.HTTP_200_OK)


class ComplaintCreateListView(generics.ListCreateAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Complaint.objects.filter(complainant=self.request.user).select_related('order', 'complainant')

    def perform_create(self, serializer):
        order_id = self.request.data.get('order')
        order = get_object_or_404(Order, pk=order_id)
        if self.request.user not in [order.buyer, order.artisan]:
            raise permissions.PermissionDenied('You can only complain about your own order.')
        serializer.save(complainant=self.request.user)


class MyComplaintListView(generics.ListAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Complaint.objects.filter(complainant=self.request.user).select_related('order', 'complainant')


class AdminComplaintListView(generics.ListAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return Complaint.objects.select_related('order', 'complainant')


class AdminComplaintResolveView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        complaint = get_object_or_404(Complaint, pk=pk)
        serializer = ComplaintResolveSerializer(complaint, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(ComplaintSerializer(complaint).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserManagementSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminPlatformStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        stats = {
            'total_users': User.objects.count(),
            'total_orders': Order.objects.count(),
            'total_complaints': Complaint.objects.count(),
            'open_complaints': Complaint.objects.filter(status='open').count(),
            'total_reviews': Review.objects.count(),
        }
        return Response(AdminPlatformStatsSerializer(stats).data, status=status.HTTP_200_OK)