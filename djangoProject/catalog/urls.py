from django.urls import path, include
from rest_framework import routers

from catalog.views import CatalogAPIView

router = routers.SimpleRouter()
router.register(r'catalog', CatalogAPIView)

urlpatterns = [
    path('', include(router.urls)),
]
