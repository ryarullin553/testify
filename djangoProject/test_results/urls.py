from django.urls import path
from .views import *

urlpatterns = [
    path('<int:test>/results/', TestResultAPIView.as_view()),  # get (list), post
    path('result/<int:result_pk>/', TestResultAPIView.as_view()),  # get (one)
    path('update_result/<int:result_pk>/', TestResultAPIView.as_view()),  # patch

    path('add_anwser/', ChoicedAnswerAPIView.as_view()),  # post
    path('update_anwser/<int:choiced_answer_pk>/', ChoicedAnswerAPIView.as_view()),  # patch
]
