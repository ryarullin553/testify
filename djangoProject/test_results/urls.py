from django.urls import path, include
from .routers import ResultRouter
from .views import ResultAPIView, ChoicedAnswerAPIView

result_router = ResultRouter()
result_router.register(r'results', ResultAPIView)

urlpatterns = [
    path('', include(result_router.urls)),

    path('add_anwser/', ChoicedAnswerAPIView.as_view()),  # post
    path('update_anwser/<int:choiced_answer_pk>/', ChoicedAnswerAPIView.as_view()),  # patch
]

