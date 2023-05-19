from django.urls import path, re_path, include
from rest_framework import routers
from users.views import UserAPIView

router = routers.SimpleRouter()
router.register(r'users', UserAPIView)

urlpatterns = [
    path('auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.authtoken')),

    path('', include(router.urls)),
]
