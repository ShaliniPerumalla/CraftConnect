from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Avg, Count, Q
from django.contrib.auth import get_user_model
from .models import Review
from .serializers import ReviewSerializer
from orders.models import Order
from marketplace.models import CreatorProfile
from notifications.services import create_notification

User = get_user_model()

class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Review.objects.all().select_related('customer', 'creator', 'order')
        creator_id = self.request.query_params.get('creator') or self.request.query_params.get('creator_id')
        order_id = self.request.query_params.get('order') or self.request.query_params.get('order_id')
        customer_id = self.request.query_params.get('customer') or self.request.query_params.get('customer_id')

        if creator_id:
            user_ids = [creator_id]
            cp = CreatorProfile.objects.filter(id=creator_id).first()
            if cp:
                user_ids.append(cp.user_id)
            qs = qs.filter(creator_id__in=user_ids)
        if order_id:
            qs = qs.filter(order_id=order_id)
        if customer_id:
            qs = qs.filter(customer_id=customer_id)

        return qs

    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required to review."}, status=status.HTTP_401_UNAUTHORIZED)

        order_id = request.data.get('order') or request.data.get('order_id')
        creator_id = request.data.get('creator') or request.data.get('creator_id')
        rating = request.data.get('rating')
        comment = request.data.get('comment', '').strip()

        if not order_id and not creator_id:
            return Response({"error": "Order ID or Creator ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not rating or not (1 <= int(rating) <= 5):
            return Response({"error": "Rating must be between 1 and 5."}, status=status.HTTP_400_BAD_REQUEST)
        if not comment:
            return Response({"error": "Review feedback comment is required."}, status=status.HTTP_400_BAD_REQUEST)

        order = None
        creator_user = None

        if order_id:
            try:
                if str(order_id).isdigit():
                    order = Order.objects.get(id=order_id)
                else:
                    order = Order.objects.get(order_number=order_id)
            except Order.DoesNotExist:
                return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

            # Rule 1: Customer must be the owner of the order
            if order.customer != request.user:
                return Response({"error": "Only the customer who placed this order can review it."}, status=status.HTTP_403_FORBIDDEN)

            # Rule 2: Order must be delivered/completed
            if order.status != 'delivered':
                return Response({"error": f"You can only review an order after delivery is completed. Current status: '{order.status}'."}, status=status.HTTP_400_BAD_REQUEST)

            # Rule 3: Prevent duplicate reviews
            if Review.objects.filter(order=order).exists():
                return Response({"error": "A review for this order has already been submitted."}, status=status.HTTP_400_BAD_REQUEST)

            creator_user = order.creator
        elif creator_id:
            # Direct creator review
            creator_user = User.objects.filter(id=creator_id).first()
            if not creator_user:
                cp = CreatorProfile.objects.filter(id=creator_id).first()
                if cp:
                    creator_user = cp.user

            if not creator_user:
                return Response({"error": "Creator not found."}, status=status.HTTP_404_NOT_FOUND)

            if request.user == creator_user:
                return Response({"error": "You cannot submit a review for yourself."}, status=status.HTTP_400_BAD_REQUEST)

            if Review.objects.filter(customer=request.user, creator=creator_user).exists():
                return Response({"error": "You have already submitted a review for this creator."}, status=status.HTTP_400_BAD_REQUEST)

            # Check if customer has a completed order with this creator
            order = Order.objects.filter(customer=request.user, creator=creator_user, status='delivered').first()

        review = Review.objects.create(
            order=order,
            customer=request.user,
            creator=creator_user,
            rating=int(rating),
            comment=comment
        )

        # Notify creator of new review
        create_notification(
            recipient=creator_user,
            notification_type='review',
            title='New Review Received',
            message=f"{request.user.username} left a {rating}★ review.",
            link=f"/creator-dashboard"
        )

        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)


class CreatorReviewSummaryView(APIView):
    """Calculate and return creator rating summary and breakdown."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, creator_id):
        reviews = Review.objects.filter(creator_id=creator_id)
        total = reviews.count()
        avg_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 5.0
        avg_rating = round(avg_rating, 2)

        distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        counts = reviews.values('rating').annotate(count=Count('id'))
        for c in counts:
            distribution[c['rating']] = c['count']

        return Response({
            "creator_id": creator_id,
            "average_rating": avg_rating,
            "total_reviews": total,
            "distribution": distribution
        }, status=status.HTTP_200_OK)


class OrderReviewDetailView(APIView):
    """Retrieve review for a given order."""
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, order_id):
        try:
            if str(order_id).isdigit():
                review = Review.objects.get(order_id=order_id)
            else:
                review = Review.objects.get(order__order_number=order_id)
            return Response(ReviewSerializer(review).data)
        except Review.DoesNotExist:
            return Response({"review": None}, status=status.HTTP_200_OK)
