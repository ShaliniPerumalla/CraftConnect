
import logging

from django.conf import settings
from django.core import signing
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from common.email_service import send_app_email
from .models import User
from .permissions import IsCustomer, IsCreator
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
    ChangePasswordSerializer,
    UserProfileSerializer,
)

logger = logging.getLogger(__name__)


def get_profile_completion_status(user):
    required_fields = [
        user.phone,
        user.address,
        user.city,
        user.state,
        user.pincode,
    ]

    return all(str(value).strip() for value in required_fields)


def get_frontend_base_url():
    return getattr(settings, "FRONTEND_URL", "http://localhost:5175").rstrip("/")


def send_verification_email(user):
    token = signing.dumps(user.id)
    verification_url = f"{get_frontend_base_url()}/verify-email/{token}"

    return send_app_email(
        to_email=user.email,
        subject="Verify your CraftConnect email",
        text_body=(
            f"Hello {user.name},\n\n"
            "Thank you for registering with CraftConnect.\n\n"
            "Please click the link below to verify your email address:\n\n"
            f"{verification_url}\n\n"
            "This verification link is valid for 24 hours.\n\n"
            "Regards,\nCraftConnect Team"
        ),
    )


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()
        existing_user = User.objects.filter(email__iexact=email).first() if email else None

        if existing_user:
            if existing_user.email_verified:
                return Response(
                    {
                        "message": (
                            "An account with this email already exists. "
                            "Please log in or use forgot password."
                        )
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            try:
                send_verification_email(existing_user)
            except Exception:
                logger.exception(
                    "Failed to resend verification email to %s",
                    existing_user.email,
                )
                return Response(
                    {
                        "message": (
                            "This account exists but is not verified. "
                            "Please try again later."
                        )
                    },
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )

            return Response(
                {
                    "message": (
                        "This account exists but is not verified. "
                        "A new verification email has been sent."
                    )
                },
                status=status.HTTP_200_OK,
            )

        serializer = UserRegistrationSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = serializer.save()

        try:
            send_verification_email(user)
        except Exception:
            logger.exception(
                "Failed to send verification email to %s",
                user.email,
            )
            return Response(
                {
                    "message": (
                        "Registration was created, but the verification "
                        "email could not be sent. Please try resending it."
                    )
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(
            {
                "message": (
                    "Registration successful. "
                    "Please check your email to verify your account."
                ),
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role,
                    "email_verified": user.email_verified,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            user_id = signing.loads(token, max_age=60 * 60 * 24)
            user = get_object_or_404(User, id=user_id)

            if user.email_verified:
                return Response(
                    {"message": "Email is already verified."},
                    status=status.HTTP_200_OK,
                )

            user.email_verified = True
            user.save(update_fields=["email_verified"])

            return Response(
                {"message": "Email verified successfully."},
                status=status.HTTP_200_OK,
            )

        except signing.SignatureExpired:
            return Response(
                {"error": "Verification link has expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except signing.BadSignature:
            return Response(
                {"error": "Invalid verification link."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "Login successful.",
                    "user": {
                        "id": user.id,
                        "name": user.name,
                        "email": user.email,
                        "role": user.role,
                        "email_verified": user.email_verified,
                        "phone": user.phone,
                        "address": user.address,
                        "city": user.city,
                        "state": user.state,
                        "pincode": user.pincode,
                        "profile_complete": get_profile_completion_status(user),
                    },
                    "tokens": {
                        "access": str(refresh.access_token),
                        "refresh": str(refresh),
                    },
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"message": "Logout successful."},
                status=status.HTTP_200_OK,
            )

        except KeyError:
            return Response(
                {"error": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            return Response(
                {"error": "Invalid or expired refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class MeView(APIView):
    def get(self, request):
        user = request.user

        return Response(
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "email_verified": user.email_verified,
                "phone": user.phone,
                "address": user.address,
                "city": user.city,
                "state": user.state,
                "pincode": user.pincode,
                "profile_complete": get_profile_completion_status(user),
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request):
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()
            user = request.user

            return Response(
                {
                    "message": "Profile updated successfully.",
                    "user": {
                        "id": user.id,
                        "name": user.name,
                        "email": user.email,
                        "role": user.role,
                        "email_verified": user.email_verified,
                        "phone": user.phone,
                        "address": user.address,
                        "city": user.city,
                        "state": user.state,
                        "pincode": user.pincode,
                        "profile_complete": get_profile_completion_status(user),
                    },
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request):
        user = request.user
        email = user.email

        user.delete()

        return Response(
            {"message": f"Account for {email} has been deleted successfully."},
            status=status.HTTP_200_OK,
        )


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data["email"]
        user = User.objects.filter(email__iexact=email).first()

        generic_message = (
            "If an account with this email exists, "
            "a password reset link has been sent."
        )

        if not user:
            return Response(
                {"message": generic_message},
                status=status.HTTP_200_OK,
            )

        token = signing.dumps(user.id)
        reset_url = f"{get_frontend_base_url()}/reset-password/{token}"

        try:
            send_app_email(
                to_email=user.email,
                subject="Reset your CraftConnect password",
                text_body=(
                    f"Hello {user.name},\n\n"
                    "We received a request to reset your CraftConnect password.\n\n"
                    "Click the link below to reset your password:\n\n"
                    f"{reset_url}\n\n"
                    "This link is valid for 1 hour.\n\n"
                    "If you did not request this, you can safely ignore this email.\n\n"
                    "Regards,\nCraftConnect Team"
                ),
            )

        except Exception:
            logger.exception(
                "Failed to send password reset email to %s",
                user.email,
            )
            return Response(
                {"message": generic_message},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(
            {"message": generic_message},
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, token):
        try:
            user_id = signing.loads(token, max_age=60 * 60)
            user = get_object_or_404(User, id=user_id)

        except signing.SignatureExpired:
            return Response(
                {"error": "Password reset link has expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except signing.BadSignature:
            return Response(
                {"error": "Invalid password reset link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = ResetPasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data["password"])
        user.save(update_fields=["password"])

        return Response(
            {"message": "Password reset successful."},
            status=status.HTTP_200_OK,
        )


class ChangePasswordView(APIView):
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user
        current_password = serializer.validated_data["current_password"]

        if not user.check_password(current_password):
            return Response(
                {"error": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_password = serializer.validated_data["new_password"]
        user.set_password(new_password)
        user.save(update_fields=["password"])

        return Response(
            {"message": "Password changed successfully."},
            status=status.HTTP_200_OK,
        )


class CustomerTestView(APIView):
    permission_classes = [IsCustomer]

    def get(self, request):
        return Response(
            {
                "message": "Customer access granted.",
                "role": request.user.role,
            },
            status=status.HTTP_200_OK,
        )


class CreatorTestView(APIView):
    permission_classes = [IsCreator]

    def get(self, request):
        return Response(
            {
                "message": "Creator access granted.",
                "role": request.user.role,
            },
            status=status.HTTP_200_OK,
        )


class ResendVerificationEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()

        if not email:
            return Response(
                {"message": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(email__iexact=email).first()

        generic_message = (
            "If an unverified account exists for this email, "
            "a verification email will be sent."
        )

        if not user or user.email_verified or not user.is_active:
            return Response(
                {"message": generic_message},
                status=status.HTTP_200_OK,
            )

        try:
            send_verification_email(user)

        except Exception:
            logger.exception(
                "Failed to resend verification email to %s",
                user.email,
            )
            return Response(
                {
                    "message": (
                        "Verification email could not be sent. "
                        "Please try again later."
                    )
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(
            {"message": generic_message},
            status=status.HTTP_200_OK,
        )
