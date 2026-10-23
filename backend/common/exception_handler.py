from rest_framework import exceptions
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler


def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)

    if response is not None:
        detail = response.data
        error_payload = {
            "success": False,
            "message": "Request failed.",
            "errors": detail,
        }

        if isinstance(exc, exceptions.ValidationError):
            error_payload["message"] = "Validation failed."
        elif isinstance(exc, exceptions.PermissionDenied):
            error_payload["message"] = "You do not have permission to perform this action."
        elif isinstance(exc, exceptions.NotAuthenticated):
            error_payload["message"] = "Authentication required."
        elif isinstance(exc, exceptions.AuthenticationFailed):
            error_payload["message"] = "Authentication failed."

        if isinstance(detail, dict):
            if "detail" in detail:
                error_payload["message"] = detail["detail"]
                error_payload["errors"] = {"detail": detail["detail"]}

        response.data = error_payload
        return response

    return Response(
        {
            "success": False,
            "message": "An unexpected server error occurred.",
            "errors": {"detail": "Internal Server Error"},
        },
        status=500,
    )
