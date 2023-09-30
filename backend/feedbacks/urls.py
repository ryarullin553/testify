from django.urls import path, include
from rest_framework import routers
from .views import FeedbackAPIView

router = routers.SimpleRouter()
router.register(r'feedbacks', FeedbackAPIView)

urlpatterns = [
    path('tests/<int:pk>/feedbacks/', FeedbackAPIView.as_view(
        {'get': 'feedbacks'}
    )),
    path('', include(router.urls)),
]
