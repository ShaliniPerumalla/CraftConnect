from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomerProfile
from marketplace.models import CreatorProfile

User = get_user_model()

def determine_user_role(user):
    if user.is_superuser or user.is_staff:
        return "admin"
    if hasattr(user, "creator_profile"):
        return "creator"
    if getattr(user, "role", None):
        return user.role
    return "customer"

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', 'password123')
        name = request.data.get('name', '').strip()
        role = request.data.get('role', 'customer').strip().lower()

        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        username = request.data.get('username', '').strip() or email.split('@')[0]
        # ensure unique username
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exclude(email=email).exists():
            username = f"{base_username}_{counter}"
            counter += 1

        user, created = User.objects.get_or_create(email=email, defaults={'username': username})
        if created:
            user.set_password(password)
            if name:
                user.first_name = name
            user.save()
        elif name and not user.first_name:
            user.first_name = name
            user.save()

        # Initialize profile according to role
        setattr(user, 'role', role)
        if role == 'creator':
            setattr(user, 'is_creator', True)
            creator_profile, _ = CreatorProfile.objects.get_or_create(
                user=user,
                defaults={"name": name or user.get_full_name() or user.username}
            )
            display_name = creator_profile.name
        else:
            cust_profile, _ = CustomerProfile.objects.get_or_create(
                user=user,
                defaults={"name": name or user.get_full_name() or user.username}
            )
            display_name = cust_profile.name

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
                "name": display_name or user.username
            }
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        username = request.data.get('username', '').strip()
        password = request.data.get('password', 'password123')
        requested_role = request.data.get('role', '').strip().lower()

        user = None
        if email:
            user = User.objects.filter(email=email).first()
        elif username:
            user = User.objects.filter(username=username).first()

        if not user:
            # Auto-provision user for seamless development/testing
            role = requested_role or 'customer'
            login_username = username or (email.split('@')[0] if email else f"user_{role}")
            user = User.objects.create_user(
                username=login_username,
                email=email or f"{login_username}@makermatch.internal",
                password=password
            )
        else:
            role = requested_role or getattr(user, 'role', None) or determine_user_role(user)

        setattr(user, 'role', role)
        if role == 'creator':
            setattr(user, 'is_creator', True)
            creator_profile, _ = CreatorProfile.objects.get_or_create(
                user=user,
                defaults={"name": user.get_full_name() or user.username}
            )
            display_name = creator_profile.name or user.get_full_name() or user.username
        else:
            cust_profile, _ = CustomerProfile.objects.get_or_create(
                user=user,
                defaults={"name": user.get_full_name() or user.username}
            )
            display_name = cust_profile.name or user.get_full_name() or user.username

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
                "name": display_name or user.username
            }
        }, status=status.HTTP_200_OK)

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        role = getattr(user, 'role', None) or determine_user_role(user)

        data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": role,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }

        if role == "creator":
            creator_profile, _ = CreatorProfile.objects.get_or_create(
                user=user,
                defaults={"name": user.get_full_name() or user.username}
            )
            data.update({
                "name": creator_profile.name or user.get_full_name() or user.username,
                "specialty": creator_profile.specialty,
                "bio": creator_profile.bio,
                "skills": creator_profile.skills,
                "location": creator_profile.location,
                "avatar": creator_profile.avatar,
                "cover": creator_profile.cover,
                "rating": float(creator_profile.rating),
                "reviews_count": creator_profile.reviews_count,
                "creator_id": creator_profile.id,
            })
        else:
            cust_profile, _ = CustomerProfile.objects.get_or_create(
                user=user,
                defaults={"name": user.get_full_name() or user.username}
            )
            data.update({
                "name": cust_profile.name or user.get_full_name() or user.username,
                "phone": cust_profile.phone,
                "avatar": cust_profile.avatar,
                "address": cust_profile.address,
                "city": cust_profile.city,
                "state": cust_profile.state,
                "pincode": cust_profile.pincode,
            })

        return Response(data)

    def patch(self, request):
        return self.put(request)

    def put(self, request):
        user = request.user
        role = getattr(user, 'role', None) or determine_user_role(user)

        # Update User fields if provided
        name = request.data.get("name")
        if name:
            user.first_name = name
            user.save()
        email = request.data.get("email")
        if email and email != user.email:
            user.email = email
            user.save()

        if role == "creator":
            creator_profile, _ = CreatorProfile.objects.get_or_create(
                user=user,
                defaults={"name": user.get_full_name() or user.username}
            )
            if "name" in request.data:
                creator_profile.name = request.data["name"]
            if "specialty" in request.data:
                creator_profile.specialty = request.data["specialty"]
            if "bio" in request.data:
                creator_profile.bio = request.data["bio"]
            if "skills" in request.data:
                creator_profile.skills = request.data["skills"]
            if "location" in request.data:
                creator_profile.location = request.data["location"]
            if "avatar" in request.data:
                creator_profile.avatar = request.data["avatar"]
            if "cover" in request.data:
                creator_profile.cover = request.data["cover"]
            creator_profile.save()
        else:
            cust_profile, _ = CustomerProfile.objects.get_or_create(
                user=user,
                defaults={"name": user.get_full_name() or user.username}
            )
            if "name" in request.data:
                cust_profile.name = request.data["name"]
            if "phone" in request.data:
                cust_profile.phone = request.data["phone"]
            if "avatar" in request.data:
                cust_profile.avatar = request.data["avatar"]
            if "address" in request.data:
                cust_profile.address = request.data["address"]
            if "city" in request.data:
                cust_profile.city = request.data["city"]
            if "state" in request.data:
                cust_profile.state = request.data["state"]
            if "pincode" in request.data:
                cust_profile.pincode = request.data["pincode"]
            cust_profile.save()

        return self.get(request)
