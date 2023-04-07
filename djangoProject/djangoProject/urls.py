from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework_nested import routers
from tests.views import *

router = routers.SimpleRouter()
router.register(r'catalog', CatalogViewSet)
router.register(r'tests', TestViewSet)

tests_router = routers.NestedSimpleRouter(router, r'tests', lookup='test')
tests_router.register(r'questions', TestQuestionViewSet, basename='test-questions')
tests_router.register(r'results', TestResultViewSet, basename='test-results')

answer_router = routers.NestedSimpleRouter(tests_router, r'questions', lookup='question')
answer_router.register(r'answers', TestAnswerViewSet, basename='test-answers')

results_router = routers.NestedSimpleRouter(tests_router, r'results', lookup='result')
results_router.register(r'answers', TestResultAnswerViewSet, basename='test-result-answers')
results_router.register(r'summary', TestResultSummaryViewSet, basename='test-result-summary')
print(*results_router.urls, sep='\n')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='users/main-page.html')),
    path('', include('users.urls')),

    path('api/v1/', include(router.urls)),
    path('api/v1/', include(tests_router.urls)),
    path('api/v1/', include(answer_router.urls)),
    path('api/v1/', include(results_router.urls)),
]
