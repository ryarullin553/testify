from django.urls import path, include
from rest_framework import routers

from .views import QuestionAPIView


router = routers.SimpleRouter()
router.register(r'questions', QuestionAPIView)

urlpatterns = [
    path('', include(router.urls)),
]
