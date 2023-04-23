from django.http import JsonResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView, get_object_or_404
from .answer_validators import answer_is_exist, choiced_answer_is_exist
from .models import Result, ChoicedAnswer
from .permissions import IsUserResult, IsUserAnswer
from .serializers import ResultSerializer, ChoicedAnswerSerializer
from .services import get_result_data


class TestResultAPIView(GenericAPIView):
    queryset = Result.objects
    serializer_class = ResultSerializer
    lookup_url_kwarg = 'result_pk'
    permission_classes = (IsAuthenticated, IsUserResult)

    def get(self, request, **kwargs):
        """Возвращает список результатов теста или конкретный результат"""
        if 'test' in kwargs:
            test_pk = kwargs.get('test')
            results = self.queryset.filter(user=request.user, test__pk=test_pk)
            serializer = self.get_serializer(results, many=True)
            return Response(serializer.data)
        else:
            result = self.get_object()
            result_data = get_result_data(result)
            return JsonResponse(result_data)

    def post(self, request, **kwargs):
        """Создает результат по принятому id теста"""
        serializer = self.serialize_data(kwargs)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request, **kwargs):
        """Завершает прохождение теста"""
        serializer = self.serialize_data(request.data, self.get_object(), partial=True)
        return Response(serializer.data)

    def serialize_data(self, data, instance=None, partial=False):
        serializer = self.get_serializer(data=data, instance=instance, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer


class ChoicedAnswerAPIView(GenericAPIView):
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

        serializer = self.serialize_data(request.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request, **kwargs):
        """Изменяет выбранный ответ в результате"""
        answer_pk = request.data.get('answer')
        result_pk = request.data.get('result')
        if not answer_pk or not result_pk:
            return JsonResponse({'error': 'В запросе не был передан answer или result'})
        if not answer_is_exist(self, answer_pk, result_pk):
            return JsonResponse({'error': f'Ответ №{answer_pk} не относится к текущему результату'})

        serializer = self.serialize_data(request.data, self.get_object(), partial=True)
        return Response(serializer.data)

    def get_instance(self, pk, model):
        instance = get_object_or_404(model, pk=pk)
        self.check_object_permissions(self.request, instance)
        return instance

    def serialize_data(self, data, instance=None, partial=False):
        serializer = self.get_serializer(data=data, instance=instance, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer
