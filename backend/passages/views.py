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
    ordering_fields = ['result__score', 'result__finished_time',
                       'result__answers_count',
                       'result__correct_answers_count', 'result__passage_time']
    ordering = '-created'

    def get_object(self):
        queryset = self.get_queryset().with_base_fields()
        instance = get_object_or_404(
            queryset, pk=self.kwargs[self.lookup_field]
        )
        self.check_object_permissions(self.request, instance)
        return instance

    def passages(self, request, *args, **kwargs):
        """
        Таблица с завершенными прохождениями теста

        Параметры для поиска: user_name, codeword
        Параметры для сортировки: result__score, result__finished_time,
        result__answers_count, result__correct_answers_count,
        result__passage_time
        """
        test_id = kwargs.get('pk')
        fields = ['id', 'user_id', 'result', 'codeword', 'user_name',
                  'user_image']
        queryset = self.get_queryset().finished(test_id)
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True, fields=fields)
        return self.get_paginated_response(serializer.data)

    def current_user(self, request, *args, **kwargs):
        """
        Прохождения теста текущего пользователя

        На странице "Тесты" по нажатию на тест выпадает список с его
        прохождениями.
        Параметры для сортировки: result__score, result__finished_time,
        result__answers_count, result__correct_answers_count,
        result__passage_time
        """
        test_id = kwargs.get('pk')
        current_user_id = self.request.user.id
        queryset = self.get_queryset().user_test(test_id, current_user_id)
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(
            page, many=True, fields=['id', 'result']
        )
        return self.get_paginated_response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """
        Завершает прохождение теста

        Тело запроса должно быть пустым
        """
        queryset = self.get_queryset().create_result()
        instance = get_object_or_404(
            queryset, pk=self.kwargs[self.lookup_field]
        )
        self.check_object_permissions(self.request, instance)
        complete_passage(instance)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
