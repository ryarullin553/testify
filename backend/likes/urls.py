from django.urls import path, include
from rest_framework import routers
from .views import LikeAPIView


router = routers.SimpleRouter()
router.register(r'likes', LikeAPIView)

urlpatterns = [
    path('', include(router.urls)),
    path('likes/<int:comment_id>/comment/', LikeAPIView.as_view(
        {'patch': 'update_comment_like'}
    )),
    path('likes/comment/<int:comment_id>/', LikeAPIView.as_view(
        {'delete': 'delete_comment_like'}
    ))
]
