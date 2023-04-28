from django.http import JsonResponse
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from .models import Result, ChoicedAnswer
from .permissions import IsUserResult, IsUserAnswer
from .serializers import ResultSerializer, ChoicedAnswerSerializer
from .services import get_result_data, answer_is_exist, choiced_answer_is_exist
from tests.mixins import APIViewMixin


class ResultAPIView(viewsets.GenericViewSet, APIViewMixin):
    queryset = Result.objects
    serializer_class = ResultSerializer
    permission_classes = (IsAuthenticated, IsUserResult)

    def get_result(self, request, **kwargs):
        """Возвращает результат теста по принятому pk из url"""
        result = self.get_object()
        result_data = get_result_data(result)
        return JsonResponse(result_data)

    def get_result_list(self, request, **kwargs):
        """Возвращает список результатов теста пользователя по принятому test_pk из url"""
        test_pk = kwargs.get('test_pk')
        results = self.queryset.filter(user=request.user, test__pk=test_pk)
        serializer = self.get_serializer(results, many=True)
        return Response(serializer.data)

    def create_result(self, request):
        """Создает результат по принятому id теста из JSON"""
        serializer = self.get_default_saved_serializer(request.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update_result(self, request, **kwargs):
        """Завершает прохождение теста, изменяя is_finished результата"""
        instance = self.get_object()
        serializer = self.get_default_saved_serializer(request.data, instance, partial=True)
        return Response(serializer.data)


class ChoicedAnswerAPIView(GenericAPIView, APIViewMixin):
    queryset = ChoicedAnswer.objects
    serializer_class = ChoicedAnswerSerializer
    permission_classes = (IsAuthenticated, IsUserAnswer)
    lookup_url_kwarg = 'choiced_answer_pk'

    def post(self, request):
        """Создает выбранный ответ в результате"""
        answer_pk = request.data.get('answer')
        result_pk = request.data.get('result')
        if not answer_pk or not result_pk:
            return JsonResponse({'error': 'В запросе не был передан answer или result'})
        if not answer_is_exist(self, answer_pk, result_pk):
            return JsonResponse({'error': f'Ответ №{answer_pk} не относится к текущему результату'})
        if choiced_answer_is_exist(self, answer_pk, result_pk):
            return JsonResponse({'error': f'Выбранный ответ уже существует'})

        serializer = self.get_default_saved_serializer(request.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request, **kwargs):
        """Изменяет выбранный ответ в результате"""
        answer_pk = request.data.get('answer')
        result_pk = request.data.get('result')
        if not answer_pk or not result_pk:
            return JsonResponse({'error': 'В запросе не был передан answer или result'})
        if not answer_is_exist(self, answer_pk, result_pk):
            return JsonResponse({'error': f'Ответ №{answer_pk} не относится к текущему результату'})

        instance = self.get_object()
        serializer = self.get_default_saved_serializer(request.data, instance, partial=True)
        return Response(serializer.data)

