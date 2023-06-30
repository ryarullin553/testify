from django.urls import path, include
from rest_framework import routers

from .views import PassageAPIView


router = routers.SimpleRouter()
router.register(r'passages', PassageAPIView)

urlpatterns = [
    path('', include(router.urls)),
]

