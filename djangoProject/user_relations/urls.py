from django.urls import path, include
from rest_framework import routers
from .views import BookmarkAPIView, FeedbackAPIView

router = routers.SimpleRouter()
router.register(r'bookmarks', BookmarkAPIView)
router.register(r'feedbacks', FeedbackAPIView)

urlpatterns = [
    path('', include(router.urls))
]
