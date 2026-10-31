from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from orders.models import Order

class Review(models.Model):
    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name='review'
    )
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews_given'
    )
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews_received'
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.rating}★ by {self.customer.email} for {self.creator.email} on Order {self.order.order_number}"

    def update_creator_profile_rating(self):
        """Recalculate creator average rating and reviews count."""
        try:
            from marketplace.models import CreatorProfile
            profile = CreatorProfile.objects.filter(user=self.creator).first()
            if profile:
                stats = Review.objects.filter(creator=self.creator).aggregate(
                    models.Avg('rating'),
                    models.Count('id')
                )
                profile.rating = round(stats['rating__avg'] or 5.0, 2)
                profile.reviews_count = stats['id__count'] or 0
                profile.save()
        except Exception as e:
            print(f"Error updating creator profile rating: {e}")

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.update_creator_profile_rating()

    def delete(self, *args, **kwargs):
        creator = self.creator
        super().delete(*args, **kwargs)
        # recompute after deletion
        try:
            from marketplace.models import CreatorProfile
            profile = CreatorProfile.objects.filter(user=creator).first()
            if profile:
                stats = Review.objects.filter(creator=creator).aggregate(
                    models.Avg('rating'),
                    models.Count('id')
                )
                profile.rating = round(stats['rating__avg'] or 5.0, 2)
                profile.reviews_count = stats['id__count'] or 0
                profile.save()
        except Exception as e:
            print(f"Error updating creator profile rating after delete: {e}")
