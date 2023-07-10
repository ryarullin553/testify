from django.urls import path, include
from rest_framework import routers
from .views import BookmarkAPIView, FeedbackAPIView, CommentAPIView, LikeAPIView

router = routers.SimpleRouter()
router.register(r'bookmarks', BookmarkAPIView)
router.register(r'feedbacks', FeedbackAPIView)
router.register(r'comments', CommentAPIView)
router.register(r'likes', LikeAPIView)

urlpatterns = [
    path('tests/<int:pk>/feedbacks/', FeedbackAPIView.as_view({'get': 'feedbacks'})),
    path('questions/<int:pk>/comments/', CommentAPIView.as_view({'get': 'comments'})),
    path('', include(router.urls)),
]
