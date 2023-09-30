from django.urls import path, include
from rest_framework import routers

from .views import PassageAPIView


router = routers.SimpleRouter()
router.register(r'passages', PassageAPIView)

urlpatterns = [
    path('', include(router.urls)),
    path('tests/<int:pk>/passages/', PassageAPIView.as_view(
        {'get': 'passages'}
    )),
    path('tests/<int:pk>/passages/my/', PassageAPIView.as_view(
        {'get': 'current_user'}
    )),
]

