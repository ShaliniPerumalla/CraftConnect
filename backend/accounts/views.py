from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', 'password123')
        name = request.data.get('name', '')
        role = request.data.get('role', 'customer')

        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        username = email.split('@')[0]
        # ensure unique username
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exclude(email=email).exists():
            username = f"{base_username}_{counter}"
            counter += 1

        user, created = User.objects.get_or_create(email=email, defaults={'username': username})
        if created:
            user.set_password(password)
            if hasattr(user, 'first_name') and name:
                user.first_name = name
            user.save()

        # attach role dynamically or to profile
        setattr(user, 'role', role)
        if role.lower() == 'creator':
            setattr(user, 'is_creator', True)

        refresh = RefreshToken.for_user(user)
        refresh['role'] = role
        refresh['email'] = user.email

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": role,
                "name": name or user.username
            }
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        username = request.data.get('username', '').strip()
        password = request.data.get('password', 'password123')
        role = request.data.get('role', 'customer')

        user = None
        if email:
            user = User.objects.filter(email=email).first()
        elif username:
            user = User.objects.filter(username=username).first()

        if not user:
            # Auto-provision user for seamless development/testing
            login_username = username or (email.split('@')[0] if email else f"user_{role}")
            user = User.objects.create_user(
                username=login_username,
                email=email or f"{login_username}@makermatch.internal",
                password=password
            )

        setattr(user, 'role', role)
        if str(role).lower() == 'creator':
            setattr(user, 'is_creator', True)

        refresh = RefreshToken.for_user(user)
        refresh['role'] = role
        refresh['email'] = user.email

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": role,
                "name": getattr(user, 'first_name', '') or user.username
            }
        }, status=status.HTTP_200_OK)

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        role = getattr(user, 'role', 'customer')
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": role,
        })
