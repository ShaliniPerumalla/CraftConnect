from rest_framework.permissions import BasePermission


class IsCustomer(BasePermission):
    message = "Only customers can access this resource."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "CUSTOMER"
        )


class IsCreator(BasePermission):
    message = "Only creators can access this resource."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "CREATOR"
        )


class IsAdmin(BasePermission):
    message = "Only administrators can access this resource."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "ADMIN"
        )


class IsCustomerOrCreator(BasePermission):
    message = "Only customers or creators can access this resource."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [
                "CUSTOMER",
                "CREATOR",
            ]
        )