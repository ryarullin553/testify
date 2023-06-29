from django.urls import path, include
from rest_framework import routers

from .views import TestAPIView


router = routers.SimpleRouter()
router.register(r'tests', TestAPIView)

urlpatterns = [
    path('', include(router.urls)),
]
