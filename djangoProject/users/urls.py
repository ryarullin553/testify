from django.contrib.auth import views
from django.urls import path, re_path, include
from rest_framework import routers
from users.views import *


urlpatterns = [
    path('auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.authtoken')),

    path('profile/<int:pk>/', UserAPIView.as_view()),  # get, put, patch
]
