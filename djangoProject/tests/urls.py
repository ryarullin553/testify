from rest_framework_nested import routers
from django.urls import path, include
from .views import *

router = routers.SimpleRouter()
router.register(r'catalog', CatalogViewSet)   # get


urlpatterns = [
    path('', include(router.urls)),
    path('tests/', TestAPIView.as_view(), name='tests'),   # get, post
    path('test/<int:test_pk>/', TestAPIView.as_view()),   # get
    path('update_test/<int:test_pk>/', TestAPIView.as_view()),  # put, delete
    path('test/<int:test_pk>/questions/', QuestionAPIView.as_view()),   # get, post
    path('update_question/<int:question_pk>/', QuestionAPIView.as_view()),    # put, delete
]
