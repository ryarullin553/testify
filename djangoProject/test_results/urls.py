from django.urls import path, include
from .routers import ResultRouter
from .views import ResultAPIView, ChoicedAnswerAPIView

result_router = ResultRouter()
result_router.register(r'results', ResultAPIView)

urlpatterns = [
    path('', include(result_router.urls)),
    path('answers/', ChoicedAnswerAPIView.as_view({'post': 'add_answer'}), name='add_answer'),
    path('answers/<int:pk>/', ChoicedAnswerAPIView.as_view({'patch': 'update_answer'}), name='update_answer'),
]

