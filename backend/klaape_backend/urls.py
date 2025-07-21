"""
URL configuration for klaape_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from klaape_users.views import UserProfileViewSet, user_profile, upload_profile_image, signup, login_user
from .views import api_root

# API Router
router = routers.DefaultRouter()
router.register(r'profiles', UserProfileViewSet)

urlpatterns = [
    path('', api_root, name='api_root'),
    path("admin/", admin.site.urls),
    
    # API endpoints
    path('api/', include(router.urls)),
    path('api/users/<int:user_id>/profile/', user_profile),
    path('api/users/<int:user_id>/profile/image/', upload_profile_image),
    
    # Authentication
    path('api/auth/', include('rest_framework.urls')),
    path('api/signup/', signup, name='signup'),
    path('api/login/', login_user, name='login'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
