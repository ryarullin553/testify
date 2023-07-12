from django.urls import path, include
from rest_framework import routers
from .views import BookmarkAPIView

router = routers.SimpleRouter()
router.register(r'bookmarks', BookmarkAPIView)

urlpatterns = [
    path('', include(router.urls)),
]
