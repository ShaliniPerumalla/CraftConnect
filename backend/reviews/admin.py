from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'customer', 'creator', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('order__order_number', 'customer__email', 'creator__email', 'comment')
