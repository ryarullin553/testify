from django.urls import path, include
from rest_framework import routers
from .views import BookmarkAPIView, FeedbackAPIView, CommentAPIView

router = routers.SimpleRouter()
router.register(r'bookmarks', BookmarkAPIView)
router.register(r'feedbacks', FeedbackAPIView)
router.register(r'comments', CommentAPIView)

urlpatterns = [
    path('', include(router.urls))
]
