from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    ordering = ("id",)

    list_display = (
        "id",
        "name",
        "email",
        "role",
        "email_verified",
        "is_active",
        "is_staff",
    )

    list_filter = (
        "role",
        "email_verified",
        "is_active",
        "is_staff",
    )

    search_fields = (
        "name",
        "email",
    )

    fieldsets = (
        (None, {
            "fields": (
                "email",
                "password",
            )
        }),
        ("Personal info", {
            "fields": (
                "name",
            )
        }),
        ("Permissions", {
            "fields": (
                "role",
                "email_verified",
                "is_active",
                "is_staff",
                "is_superuser",
                "groups",
                "user_permissions",
            )
        }),
        ("Important dates", {
            "fields": (
                "last_login",
                "created_at",
                "updated_at",
            )
        }),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email",
                "name",
                "password1",
                "password2",
                "role",
            ),
        }),
    )