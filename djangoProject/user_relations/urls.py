from django.urls import path, include
from rest_framework import routers
from .views import BookmarkAPIView, FeedbackAPIView, CommentAPIView, LikeDislikeAPIView

router = routers.SimpleRouter()
router.register(r'bookmarks', BookmarkAPIView)
router.register(r'feedbacks', FeedbackAPIView)
router.register(r'comments', CommentAPIView)
router.register(r'likes', LikeDislikeAPIView)

urlpatterns = [
    path('', include(router.urls))
]
