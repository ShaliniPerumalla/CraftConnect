from rest_framework import serializers
from .models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = [
            "name",
            "email",
            "password",
            "role",
        ]

    def validate_email(self, value):
        email = value.lower().strip()

        if not email:
            raise serializers.ValidationError("Email is required.")

        return email

    def validate_role(self, value):
        if value not in [
            User.CUSTOMER,
            User.CREATOR,
        ]:
            raise serializers.ValidationError(
                "Only Customer or Creator accounts can be registered."
            )

        return value

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True
    )

    def validate(self, attrs):
        email = attrs["email"].lower().strip()
        password = attrs["password"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        if not user.check_password(password):
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "This account is inactive."
            )

        if not user.email_verified:
            raise serializers.ValidationError(
                "Please verify your email before logging in."
            )

        attrs["user"] = user

        return attrs
class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return value.lower().strip()


class ResetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    confirm_password = serializers.CharField(
        write_only=True
    )

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                "Passwords do not match."
            )

        return attrs
class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(
        write_only=True
    )

    new_password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    confirm_password = serializers.CharField(
        write_only=True
    )

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                "New passwords do not match."
            )

        if attrs["current_password"] == attrs["new_password"]:
            raise serializers.ValidationError(
                "New password must be different from the current password."
            )

        return attrs
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "name",
            "phone",
            "address",
            "city",
            "state",
            "pincode",
        ]

    def validate(self, attrs):
        for field in ["name", "phone", "address", "city", "state", "pincode"]:
            if field in attrs and isinstance(attrs[field], str):
                attrs[field] = attrs[field].strip()

        return attrs