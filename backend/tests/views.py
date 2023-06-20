from django.contrib.auth.models import AnonymousUser
from django.db.models import Count, Avg, Exists, OuterRef
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import pagination, viewsets
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from results.models import Result
from user_relations.models import Bookmark
from user_relations.serializers import FeedbackSerializer
from .models import Test
from .permissions import IsTestAuthor
from .serializers import TestSerializer


class TestAPIView(viewsets.ModelViewSet):
    queryset = Test.objects
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsTestAuthor]
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ['title', 'description', 'user__username']
    filterset_fields = ['is_published', 'user']
    ordering_fields = ['rating', 'results_count', 'created']
    ordering = '-created'

    def get_catalog_queryset(self, fields):
        user = self.request.user
        if isinstance(user, AnonymousUser):
            user = 0
        result = Result.objects.filter(
            test=OuterRef(self.lookup_field),
            user=user,
            total__isnull=True
        )
        bookmark = Bookmark.objects.filter(
            test=OuterRef(self.lookup_field),
            user=user
        )
        queryset = self.queryset \
            .filter(is_published=True) \
            .select_related('user') \
            .annotate(
                results_count=Count('results', distinct=True),
                feedbacks_count=Count('feedbacks', distinct=True),
                rating=Avg('feedbacks__rate'),
                in_bookmarks=Exists(bookmark),
                has_passage=Exists(result)
            ) \
            .only(*fields)
        return queryset

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
        fields = ('title', 'short_description', 'image', 'description', 'user__username', 'user__avatar', 'user__bio')
        queryset = self.get_catalog_queryset(fields)
        instance = get_object_or_404(queryset, pk=self.kwargs[self.lookup_field])
        serializer_fields = ('id', 'title', 'short_description', 'image', 'description',
                             'rating', 'feedbacks_count', 'results_count',
                             'user', 'user_name', 'user_avatar', 'user_bio',
                             'in_bookmarks', 'has_passage')
        serializer = self.get_serializer(instance, fields=serializer_fields)
        return Response(serializer.data)

    @action(detail=False, url_path='created', url_name='created', search_fields=['title'])
    def get_created_tests(self, request):
        """Возвращает список тестов, которые создал пользователь"""
        fields = ('id', 'title', 'image', 'is_published', 'created')
        queryset = self.get_queryset()\
            .filter(user=request.user)\
            .only(*fields)
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True, fields=fields)
        return self.get_paginated_response(serializer.data)

    @action(detail=False, url_path='user/(?P<user>[^/.]+)', url_name='user', search_fields=['title'])   # Old
    def get_user_tests(self, request, **kwargs):
        """Возвращает список тестов, которые пользователь прошел или еще проходит"""
        user = kwargs.get('user')
        if user == 'me':
            user = request.user
        user_tests = self.queryset.filter(results__user=user)
        is_finished = self.request.query_params.get('is_finished')
        if is_finished == 'True':
            user_tests = user_tests.filter(results__total__isnull=False)
        elif is_finished == 'False':
            user_tests = user_tests.filter(results__total__isnull=True)
        queryset = self.filter_queryset(user_tests)
        page = self.paginate_queryset(queryset)
        serializer_fields = ('id', 'title', 'avatar')
        serializer = self.get_serializer(page, many=True, fields=serializer_fields)
        return self.get_paginated_response(serializer.data)

    @action(detail=True, url_path='settings', url_name='settings')
    def get_test_settings(self, request, **kwargs):
        """Возвращает настройки теста"""
        fields = ('id', 'title', 'short_description', 'description', 'image', 'is_published',
                  'has_points', 'has_comments', 'has_right_answers', 'has_questions_explanation')
        queryset = self.get_queryset() \
            .only(*fields)
        instance = get_object_or_404(queryset, pk=self.kwargs[self.lookup_field])
        serializer = self.get_serializer(instance, fields=fields)
        return Response(serializer.data)

    @action(detail=True, url_path='questions', url_name='questions')  # Old
    def get_test_questions(self, request, **kwargs):
        """Возвращает название теста, публикацию и список вопросов с ответами"""
        test = self.get_object()
        serializer_fields = ('title', 'is_published', 'question_set')
        serializer = self.get_serializer(test, fields=serializer_fields)
        return Response(serializer.data)

    @action(detail=True, url_path='feedbacks', url_name='feedbacks', ordering_fields=['created'])  # Old
    def get_test_feedbacks(self, request, **kwargs):
        """Возвращает отзывы теста"""
        test = self.get_object()
        page = self.paginate_queryset(test.feedbacks)
        serializer = FeedbackSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)
