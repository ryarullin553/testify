from django.db.models import Count, Avg, Exists, OuterRef
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response


from .models import Test
from .permissions import TestPermission
from .serializers import TestSerializer
from bookmarks.models import Bookmark
from passages.models import Passage


class TestAPIView(viewsets.ModelViewSet):
    queryset = Test.objects
    serializer_class = TestSerializer
    permission_classes = [TestPermission]
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ['title', 'short_description', 'user__username']
    filterset_fields = ['is_published', 'user']
    ordering_fields = ['rating', 'results_count', 'created']
    ordering = '-created'

    def get_catalog_queryset(self, fields):
        current_user_id = self.request.user.id
        passage = Passage.objects.filter(
            test_id=OuterRef(self.lookup_field),
            user_id=current_user_id,
            result__isnull=True
        )
        bookmark = Bookmark.objects.filter(
            test_id=OuterRef(self.lookup_field),
            user_id=current_user_id
        )
        queryset = self.queryset \
            .filter(is_published=True) \
            .select_related('user') \
            .annotate(
                results_count=Count('passages', distinct=True),
                feedbacks_count=Count('feedbacks', distinct=True),
                rating=Avg('feedbacks__rate'),
                in_bookmarks=Exists(bookmark),
                has_passage=Exists(passage)
            ) \
            .only(*fields)
        return queryset

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        """Возвращает каталог тестов"""
        fields = ('title', 'short_description', 'image', 'user__username')
        queryset = self.get_catalog_queryset(fields)
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        serializer_fields = ('id', 'title', 'short_description', 'image',
                             'rating', 'feedbacks_count', 'results_count',
                             'user', 'user_name',
                             'in_bookmarks', 'has_passage')
        serializer = self.get_serializer(page, many=True, fields=serializer_fields)
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """Возвращает страницу теста"""
        fields = ('title', 'short_description', 'image', 'description', 'user__username', 'user__image', 'user__info')
        queryset = self.get_catalog_queryset(fields)
        instance = get_object_or_404(queryset, pk=self.kwargs[self.lookup_field])
        serializer_fields = ('id', 'title', 'short_description', 'image', 'description',
                             'rating', 'feedbacks_count', 'results_count',
                             'user', 'user_name', 'user_image', 'user_info',
                             'in_bookmarks', 'has_passage')
        serializer = self.get_serializer(instance, fields=serializer_fields)
        return Response(serializer.data)

    @action(detail=False, url_path='created', url_name='created', search_fields=['title'])
    def created(self, request):
        """Возвращает список тестов, которые создал пользователь"""
        fields = ('id', 'title', 'image', 'is_published', 'created')
        queryset = self.get_queryset() \
            .filter(user=request.user) \
            .only(*fields)
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True, fields=fields)
        return self.get_paginated_response(serializer.data)

    @action(detail=True, url_path='config', url_name='config')
    def config(self, request, **kwargs):
        """Возвращает настройки теста"""
        fields = ('id', 'title', 'short_description', 'description', 'image', 'is_published',
                  'has_points', 'has_comments', 'has_right_answers', 'has_questions_explanation')
        queryset = self.get_queryset() \
            .only(*fields)
        instance = get_object_or_404(queryset, pk=self.kwargs[self.lookup_field])
        serializer = self.get_serializer(instance, fields=fields)
        return Response(serializer.data)

    @action(detail=True, url_path='questions', url_name='questions')
    def questions(self, request, **kwargs):
        """Возвращает название теста, статус публикации, настройки и список вопросов"""
        fields = ['id', 'title', 'is_published', 'has_points', 'has_questions_explanation',
                  'has_right_answers', 'has_comments', 'user']
        queryset = self.get_queryset()\
            .only(*fields)
        instance = get_object_or_404(queryset, pk=self.kwargs[self.lookup_field])
        serializer = self.get_serializer(instance, fields=fields[:5] + ['questions'])
        return Response(serializer.data)

    def passed_tests(self, request):
        current_user = request.user
        fields = ('id', 'title', 'image')
        queryset = self.get_queryset()\
            .filter(passages__user_id=current_user.id)\
            .only(*fields)\
            .distinct()
        queryset = self.filter_queryset(queryset)
        queryset = self.__filter_passed_tests(queryset)
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True, fields=fields)
        return self.get_paginated_response(serializer.data)

    def __filter_passed_tests(self, queryset):
        value = self.request.query_params.get('is_finished')
        if value == 'True':
            return queryset.filter(passages__result__isnull=False)
        elif value == 'False':
            return queryset.filter(passages__result__isnull=True)
        return queryset

