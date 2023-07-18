from django.db.models import Count, Sum, Q, F
from rest_framework import viewsets, mixins
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from .models import Passage
from .permissions import PassagePermission
from .serializers import PassageSerializer
from .services import complete_passage


class PassageAPIView(mixins.CreateModelMixin,
                     mixins.RetrieveModelMixin,
                     viewsets.GenericViewSet):
    queryset = Passage.objects
    serializer_class = PassageSerializer
    permission_classes = [PassagePermission]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['codeword', 'user__username']
    ordering_fields = ['result__score', 'result__finished_time', 'result__answers_count',
                       'result__correct_answers_count', 'result__passage_time']
    ordering = '-created'

    def get_object(self):
        fields = ['id', 'test', 'result', 'user_id', 'codeword',
                  'test__title', 'test__has_points', 'test__has_questions_explanation',
                  'test__has_right_answers', 'test__user_id']
        queryset = self.get_queryset() \
            .select_related('test') \
            .only(*fields)
        instance = get_object_or_404(queryset, pk=self.kwargs[self.lookup_field])
        self.check_object_permissions(self.request, instance)
        return instance

    def passages(self, request, *args, **kwargs):
        """
        Возвращает завершенные прохождения теста

        Поля для поиска: user_name, codeword
        Поля для сортировки: result__score, result__finished_time, result__answers_count,
        result__correct_answers_count, result__passage_time
        """
        test_id = kwargs.get('pk')
        fields = ['id', 'user_id', 'result', 'codeword']
        queryset = self.get_queryset() \
            .filter(
                test__id=test_id,
                result__isnull=False
            ) \
            .annotate(
                user_name=F('user__username')
            ) \
            .only(*fields)
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True, fields=fields + ['user_name'])
        return self.get_paginated_response(serializer.data)

    def current_user(self, request, *args, **kwargs):
        """
        Возвращает прохождения теста текущего пользователя

        Поля для сортировки: result__score, result__finished_time, result__answers_count,
        result__correct_answers_count, result__passage_time
        """
        test_id = kwargs.get('pk')
        current_user = self.request.user
        fields = ['id', 'result']
        queryset = self.get_queryset() \
            .filter(
                test__id=test_id,
                user=current_user
            ) \
            .only(*fields)
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True, fields=fields)
        return self.get_paginated_response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """
        Завершает прохождение теста

        Тело запроса должно быть пустым
        """
        fields = ['id', 'result', 'created', 'user_id', 'test_id',
                  'test__id', 'test__has_points']
        queryset = self.get_queryset()\
            .select_related('test')\
            .annotate(
                questions_count=Count(
                    expression='test__questions',
                    distinct=True
                ),
                answers_count=Count(
                    expression='answers',
                    distinct=True
                ),
                correct_answers_count=Count(
                    expression='answers',
                    filter=Q(
                        answers__content=F('test__questions__right_answers')
                    ),
                    distinct=True
                ),
                total_points=Sum(
                    'test__questions__points',
                    distinct=True
                ),
                user_points=Sum(
                    'test__questions__points',
                    filter=Q(
                        answers__content=F('test__questions__right_answers')
                    ),
                    distinct=True
                )
            )\
            .only(*fields)
        instance = get_object_or_404(queryset, pk=self.kwargs[self.lookup_field])
        self.check_object_permissions(self.request, instance)
        complete_passage(instance)
        return Response()
