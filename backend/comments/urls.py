from django.urls import path, include
from rest_framework import routers
from .views import CommentAPIView

router = routers.SimpleRouter()
router.register(r'comments', CommentAPIView)

urlpatterns = [
    path('questions/<int:pk>/comments/', CommentAPIView.as_view({'get': 'comments'})),
    path('', include(router.urls)),
]