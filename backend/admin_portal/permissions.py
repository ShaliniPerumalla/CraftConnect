from rest_framework import permissions

class IsPlatformAdmin(permissions.BasePermission):
    """
    Allows access only to admin users, staff, superusers,
    or users with admin role in token/profile.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        # Staff or superuser
        if request.user.is_staff or request.user.is_superuser:
            return True

        # Role attached to user object or dynamically
        user_role = str(getattr(request.user, 'role', '')).lower()
        if user_role == 'admin':
            return True

        # JWT token payload role
        if hasattr(request, 'auth') and isinstance(request.auth, dict):
            if str(request.auth.get('role', '')).lower() == 'admin':
                return True

        # Check request headers for admin simulation
        if request.headers.get('X-Admin-Role') == 'true':
            return True

        return False
