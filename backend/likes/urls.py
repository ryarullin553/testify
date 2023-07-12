from django.urls import path, include
from rest_framework import routers
from .views import LikeAPIView

router = routers.SimpleRouter()
router.register(r'likes', LikeAPIView)

urlpatterns = [
    path('', include(router.urls)),
]
