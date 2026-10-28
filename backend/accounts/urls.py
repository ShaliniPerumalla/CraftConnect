from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView,
    VerifyEmailView,
    LoginView,
    LogoutView,
    MeView,
    ForgotPasswordView,
    ResetPasswordView,
    ChangePasswordView,
    ResendVerificationEmailView,

)


urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    path(
        "verify-email/<str:token>/",
        VerifyEmailView.as_view(),
        name="verify-email",
    ),
    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),
    path(
    "refresh/",
    TokenRefreshView.as_view(),
    name="token-refresh",
    ),
    path(
        "logout/",
        LogoutView.as_view(),
        name="logout",
    ),
    path(
        "me/",
        MeView.as_view(),
        name="me",
    ),
    path(
        "forgot-password/",
        ForgotPasswordView.as_view(),
        name="forgot-password",
    ),
    path(
        "reset-password/<str:token>/",
        ResetPasswordView.as_view(),
        name="reset-password",
    ),
    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="change-password",
    ),
    path(
        "resend-verification-email/",
        ResendVerificationEmailView.as_view(),
        name="resend-verification-email",
    ),

]