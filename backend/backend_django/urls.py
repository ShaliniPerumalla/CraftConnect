"""
URL configuration for backend_django project.
"""
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def api_root(request):
    return JsonResponse({
        'message': 'CraftConnect API is running',
        'status': 'ok',
        'version': '1.0',
    })


urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/', include('orders.urls')),
]
