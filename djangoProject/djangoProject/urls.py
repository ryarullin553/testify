from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework_nested import routers
from tests.views import *

router = routers.SimpleRouter()
router.register(r'catalog', CatalogViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='users/main-page.html')),
    path('api/', include(router.urls)),

    path('api/create_test/', CreateTestAPIView.as_view()),
    path('api/create_test/<int:pk>/', CreateTestAPIView.as_view()),
    path('api/create_question/', CreateTestQuestionAPIView.as_view()),
    path('api/create_question/<int:pk>/', CreateTestQuestionAPIView.as_view()),
]
