from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework_nested import routers
from tests.views import *

router = routers.SimpleRouter()
router.register(r'catalog', CatalogViewSet)   # get


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='users/main-page.html')),
    path('api/', include(router.urls)),

    path('api/tests/', TestAPIView.as_view()),   # get, post
    path('api/test/<int:test_pk>/', TestAPIView.as_view()),   # get
    path('api/update_test/<int:test_pk>/', TestAPIView.as_view()),  # put, delete
    path('api/test/<int:test_pk>/questions/', QuestionAPIView.as_view()),   # get, post
    path('api/update_question/<int:question_pk>/', QuestionAPIView.as_view()),    # put, delete

    path('api/auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.authtoken')),
]
