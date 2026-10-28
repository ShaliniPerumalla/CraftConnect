from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit or delete it.
    Read-only permissions are allowed for any request.
    """

    def has_permission(self, request, view):
        # Read-only actions allowed to anyone
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write actions require authentication
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True

        if not request.user or not request.user.is_authenticated:
            return False

        # If checking a CreatorProfile
        if hasattr(obj, "user"):
            return obj.user == request.user

        # If checking a Product/Craft
        if hasattr(obj, "creator"):
            return obj.creator.user == request.user

        return False


class IsCreatorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to ensure that only authenticated creators can create products.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        if not request.user or not request.user.is_authenticated:
            return False

        return hasattr(request.user, "creator_profile")
