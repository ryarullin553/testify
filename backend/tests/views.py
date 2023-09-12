from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from .models import Test
from .permissions import CatalogPermission, TestPermission
from .serializers import TestSerializer


class TestAPIView(viewsets.ModelViewSet):
    queryset = Test.objects
    serializer_class = TestSerializer
    permission_classes = [CatalogPermission]
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ['title', 'short_description', 'user__username']
    filterset_fields = ['is_published', 'user']
    ordering_fields = ['rating', 'results_count', 'created']
    ordering = '-created'

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        """
        Каталог тестов

        Параметры для поиска: title, short_description, username
        Параметры для сортировки: rating, results_count, created, -created
        Параметры для фильтрации: user={user_id}
        """
        fields = ['id', 'title', 'short_description', 'image', 'rating', 'feedbacks_count', 'results_count']
        current_user_id = request.user.id
        queryset = self.get_queryset().for_catalog(fields + ['user__username'], current_user_id)
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(
            instance=page,
            many=True,
            fields=fields + ['user', 'user_name', 'in_bookmarks', 'has_passage']
        )
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """
        Страница теста

        Основная информация о тесте доступная всем пользователям
        """
        fields = ['id', 'title', 'short_description', 'image', 'description',
                  'rating', 'feedbacks_count', 'results_count']
        current_user_id = request.user.id
        queryset = self.get_queryset().for_catalog(
            fields + ['user__username', 'user__image', 'user__info'], current_user_id
        )
        instance = get_object_or_404(queryset, pk=self.kwargs[self.lookup_field])
        serializer = self.get_serializer(
            instance=instance,
            fields=fields + ['user', 'user_name', 'user_image', 'user_info', 'in_bookmarks', 'has_passage']
        )
        return Response(serializer.data)

    @action(detail=False,
            url_path='created',
            url_name='created',
            search_fields=['title'])
    def created(self, request):
        """
        Созданные тесты

        Список всех тестов, которые создал пользователь. Открывается по разделу "Мои тесты" в профиле
        или автоматически после создания теста.
        Параметры для поиска: title, short_description
        Параметры для фильтрации: is_published={Bool}
        """
        fields = ['id', 'title', 'image', 'is_published', 'created']
        current_user_id = request.user.id
        queryset = self.get_queryset() \
            .filter(user_id=current_user_id) \
            .only(*fields)
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True, fields=fields)
        return self.get_paginated_response(serializer.data)

    @action(detail=True,
            url_path='config',
            url_name='config',
            permission_classes=[TestPermission])
    def config(self, request, **kwargs):
        """
        Настройки теста

        Позволяет создать тест по кнопке "Создать тест" в шапке или на главной странице.
        Позволяет изменить настройки созданного теста по кнопке "Настройки" на странице "Созданные тесты".
        Обязательные поля для заполнения: "Название", "Краткое описание"
        Опциональные поля: "Полное описание", "Логотип" - PNG или JPG изображение
        Кнопки переключения (с всплывающими подсказками):
        1. Статус публикации (Показать/скрыть тест в каталоге)
        2. Баллы (Добавить систему баллов к вопросам)
          - Добавит поле с вводом числа на странице "Создание вопросов"
          - На странице "Результат" появится строка с количеством полученных баллов после прохождения
          - На странице "Статистика" появится столбец "Баллы", отображающий баллы полученные пользователями
        3. Комментарии (Открыть комментарии к вопросам при прохождении)
          - Добавит форму для ввода комментария и отобразит комментарии пользователей на странице "Вопросы"
        4. Правильные ответы (Показать правильные ответы после прохождения теста)
          - После завершения теста на странице "Результат", на каждом вопросе отобразится правильный ответ(ы)
        5. Пояснения к вопросам (Показывать пояснения к вопросам после прохождения теста)
          - Добавит текстовое поле для добавления пояснения на странице "Создание вопросов"
          - После прохождения теста на странице "Результат" появятся пояснения к вопросам
        """
        fields = ['id', 'title', 'short_description', 'description', 'image', 'is_published',
                  'has_points', 'has_comments', 'has_right_answers', 'has_questions_explanation']
        queryset = self.get_queryset().only(*fields)
        instance = get_object_or_404(queryset, pk=self.kwargs[self.lookup_field])
        serializer = self.get_serializer(instance, fields=fields)
        return Response(serializer.data)

    @action(detail=True,
            url_path='questions',
            url_name='questions',
            permission_classes=[TestPermission])
    def questions(self, request, **kwargs):
        """
        Данные для страницы "Создание вопросов"

        Возвращает список вопросов, название теста и его настройки
        """
        fields = ['id', 'title', 'is_published', 'has_points', 'has_questions_explanation',
                  'has_right_answers', 'has_comments', 'user']
        queryset = self.get_queryset().only(*fields)
        instance = get_object_or_404(queryset, pk=self.kwargs[self.lookup_field])
        serializer = self.get_serializer(instance, fields=fields[:5] + ['questions'])
        return Response(serializer.data)

    @action(detail=True,
            url_path='metrics',
            url_name='metrics',
            permission_classes=[TestPermission])
    def metrics(self, request, **kwargs):
        """
        Статистика

        Возвращает дату создания теста, рейтинг, количество отзывов и прохождений, средний результат,
        среднее количество ответов, среднее количество верных ответов
        """
        fields = ['id', 'title', 'created', 'rating', 'feedbacks_count', 'results_count',
                  'avg_score', 'avg_answers_count', 'avg_correct_answers_count']
        queryset = self.get_queryset().only(*fields)
        instance = get_object_or_404(queryset, pk=self.kwargs[self.lookup_field])
        serializer = self.get_serializer(instance, fields=fields)
        return Response(serializer.data)

    def passed_tests(self, request):
        """
        Тесты, которые пользователь прошел или еще проходит

        Список тестов для страницы "Тесты"
        Параметры для поиска: title
        Параметры для фильтрации: is_finished={Bool}
        """
        current_user_id = request.user.id
        queryset = self.get_queryset().passed(current_user_id)
        queryset = self.filter_queryset(queryset)
        queryset = self.__filter_passed_tests(queryset)
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True, fields=['id', 'title', 'image'])
        return self.get_paginated_response(serializer.data)

    def __filter_passed_tests(self, queryset):
        """
        Фильтрация тестов, которые пользователь прошел или еще проходит

        Пройденные - is_finished=True
        Прохожу сейчас - is_finished=False
        """
        value = self.request.query_params.get('is_finished')
        if value == 'True':
            return queryset.filter(passages__result__isnull=False)
        elif value == 'False':
            return queryset.filter(passages__result__isnull=True)
        return queryset
