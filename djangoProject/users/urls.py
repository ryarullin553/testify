from django.contrib.auth import views
from django.urls import path, re_path, include
from rest_framework import routers
from users.views import *

# router = routers.SimpleRouter()
# router.register(r'profile', MyUserViewSet)


urlpatterns = [
    path('api/auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.authtoken')),

    path('profile/<int:pk>/', MyUserAPIView.as_view()),  # get, put, patch
]
