from rest_framework.response import Response


def success_response(data=None, message="Success", status_code=200, **extra):
    payload = {
        "success": True,
        "message": message,
    }

    if data is not None:
        payload["data"] = data

    if extra:
        payload.update(extra)

    return Response(payload, status=status_code)


def error_response(message="Something went wrong.", errors=None, status_code=400, **extra):
    payload = {
        "success": False,
        "message": message,
    }

    if errors is not None:
        payload["errors"] = errors

    if extra:
        payload.update(extra)

    return Response(payload, status=status_code)
