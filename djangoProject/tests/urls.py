from rest_framework_nested import routers
from django.urls import path, include

from .routers import TestRouter, QuestionRouter
from .views import CatalogAPIView, TestAPIView, QuestionAPIView

router = routers.SimpleRouter()
router.register(r'catalog', CatalogAPIView)

tests_router = TestRouter()
tests_router.register(r'tests', TestAPIView)

question_router = QuestionRouter()
question_router.register(r'questions', QuestionAPIView)

urlpatterns = [
    path('', include(router.urls)),
    path('', include(tests_router.urls)),
    path('', include(question_router.urls)),
]

