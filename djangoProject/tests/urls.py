from rest_framework_nested import routers
from django.urls import path, include
from .views import *

router = routers.SimpleRouter()
router.register(r'catalog', CatalogViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('user_tests/', TestAPIView.as_view({'get': 'get_user_tests'}), name='get_user_tests'),
    path('create_test/', TestAPIView.as_view({'post': 'create_test'}), name='create_test'),
    path('test_description/<int:pk>/', TestAPIView.as_view({'get': 'get_test_description'}), name='get_test_description'),
    path('test_questions/<int:pk>/', TestAPIView.as_view({'get': 'get_test_questions'}), name='get_test_questions'),
    path('update_test/<int:pk>/', TestAPIView.as_view({'patch': 'update_test_description'}), name='update_test_description'),
    path('delete_test/<int:pk>/', TestAPIView.as_view({'delete': 'delete_test'}), name='delete_test'),

    path('create_question/', QuestionAPIView.as_view({'post': 'create_question'}), name='create_question'),
    path('update_question/<int:pk>/', QuestionAPIView.as_view({'patch': 'update_question'}), name='update_question'),
    path('delete_question/<int:pk>/', QuestionAPIView.as_view({'delete': 'delete_question'}), name='delete_question'),
]
