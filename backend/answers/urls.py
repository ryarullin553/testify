from django.urls import path, include
from rest_framework import routers

from .views import AnswerAPIView


router = routers.SimpleRouter()
router.register(r'answers', AnswerAPIView)

urlpatterns = [
    path('', include(router.urls)),
]
