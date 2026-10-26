import os
import uuid
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework.exceptions import ValidationError

ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


def validate_image_file(file_obj):
    """
    Validates file MIME type and size.
    """
    if not file_obj:
        raise ValidationError("No image file provided.")

    if file_obj.content_type not in ALLOWED_IMAGE_TYPES:
        raise ValidationError(
            f"Unsupported image type '{file_obj.content_type}'. Allowed types: JPG, PNG, WEBP, GIF."
        )

    if file_obj.size > MAX_IMAGE_SIZE_BYTES:
        raise ValidationError(
            f"Image size exceeds 5MB limit ({file_obj.size / (1024 * 1024):.2f}MB)."
        )

    return True


def upload_marketplace_image(file_obj, folder="makermatch/marketplace"):
    """
    Uploads an image to Cloudinary if configured.
    Falls back to Django storage if Cloudinary credentials are not present.
    Returns: dict with 'url' and 'public_id'.
    """
    validate_image_file(file_obj)

    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME") or getattr(settings, "CLOUDINARY_STORAGE", {}).get("CLOUD_NAME")
    api_key = os.getenv("CLOUDINARY_API_KEY") or getattr(settings, "CLOUDINARY_STORAGE", {}).get("API_KEY")
    api_secret = os.getenv("CLOUDINARY_API_SECRET") or getattr(settings, "CLOUDINARY_STORAGE", {}).get("API_SECRET")

    if cloud_name and api_key and api_secret:
        try:
            import cloudinary
            import cloudinary.uploader

            cloudinary.config(
                cloud_name=cloud_name,
                api_key=api_key,
                api_secret=api_secret,
                secure=True,
            )

            result = cloudinary.uploader.upload(
                file_obj,
                folder=folder,
                resource_type="image",
            )

            return {
                "url": result.get("secure_url") or result.get("url"),
                "public_id": result.get("public_id"),
            }
        except Exception as error:
            # If Cloudinary network error occurs, fall back to local storage
            pass

    # Local fallback for development / test environments without Cloudinary credentials
    filename = f"{uuid.uuid4().hex}_{file_obj.name}"
    save_path = os.path.join("marketplace_uploads", filename)
    saved_name = default_storage.save(save_path, file_obj)
    file_url = default_storage.url(saved_name)

    return {
        "url": file_url,
        "public_id": f"local_{filename}",
    }
