from django.http import JsonResponse
from rest_framework import status, viewsets
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from tests.serializers import TestSerializer
from .models import Result, ChoicedAnswer
from .permissions import IsUserResult, IsUserAnswer
from .serializers import ResultSerializer, ChoicedAnswerSerializer
from .services import update_result_passage, get_total_data
from tests.mixins import APIViewMixin


class ResultAPIView(viewsets.GenericViewSet, APIViewMixin):
    queryset = Result.objects
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated, IsUserResult]
    filter_backends = [OrderingFilter]
    ordering = '-time_create'

    def get_result(self, request, **kwargs):
        """Возвращает результат теста по принятому pk из url"""
        result = self.get_object()
        serializer = self.get_serializer(result)
        return JsonResponse(serializer.data)

    def get_result_list(self, request, **kwargs):
        """Возвращает список результатов теста пользователя по принятому test_pk из url"""
        test_pk = kwargs.get('test_pk')
        results = self.queryset.filter(user=request.user, test__pk=test_pk)
        page = self.paginate_queryset(results)
        serializer = self.get_serializer(page, many=True, fields=('id', 'total'))
        return self.get_paginated_response(serializer.data)

    def create_result(self, request):
        """Создает результат по принятому id теста из JSON"""
        serializer = self.get_saved_serializer(request.data)
        result = serializer.instance
        test_serializer = TestSerializer(result.test, fields=('title', 'question_set'))
        serializer = self.get_saved_serializer({'passage': test_serializer.data}, result, partial=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update_result(self, request, **kwargs):
        """Завершает прохождение теста, добавляя total результата"""
        result = self.get_object()
        total = get_total_data(result)
        serializer = self.get_saved_serializer({'total': total}, result, partial=True)
        return Response(serializer.data)


class ChoicedAnswerAPIView(viewsets.GenericViewSet, APIViewMixin):
    queryset = ChoicedAnswer.objects
    serializer_class = ChoicedAnswerSerializer
    permission_classes = (IsAuthenticated, IsUserAnswer)

    def add_answer(self, request):
        """Добавляет выбранный ответ при прохождении теста"""
        serializer = self.get_saved_serializer(request.data)
        choiced_answer = serializer.instance
        update_result_passage(choiced_answer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update_answer(self, request, **kwargs):
        """Изменяет выбранный ответ при прохождении теста"""
        choiced_answer = self.get_object()
        serializer = self.get_saved_serializer(request.data, choiced_answer, partial=True)
        update_result_passage(choiced_answer)
        return Response(serializer.data)
