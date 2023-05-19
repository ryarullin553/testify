from django.db.models import Count, Avg, Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import viewsets

from user_relations.serializers import FeedbackSerializer
from .models import Test, Question
from .permissions import IsTestAuthor, IsQuestionAuthor
from .serializers import TestSerializer, QuestionSerializer


class TestAPIView(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    queryset = Test.objects.annotate(
        results_count=Count('results', distinct=True),
        feedbacks_count=Count('feedbacks', distinct=True),
        rating=Avg('feedbacks__rate'),
    )
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsTestAuthor]
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ['title', 'description']
    ordering_fields = ['rating', 'results_count', 'created']
    ordering = '-rating'
    filterset_fields = ['is_published', 'user']

    def list(self, request, *args, **kwargs):
        """Возвращает каталог тестов"""
        tests = self.queryset.filter(is_published=True)
        queryset = self.filter_queryset(tests)
        page = self.paginate_queryset(queryset)
        serializer_fields = ('id', 'title', 'description', 'avatar', 'rating', 'feedbacks_count', 'results_count',
                             'in_bookmarks')
        serializer = self.get_serializer(page, many=True, fields=serializer_fields)
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """Возвращает страницу теста"""
        instance = self.get_object()
        serializer_fields = ('id', 'title', 'description', 'avatar', 'full_description', 'rating', 'feedbacks_count',
                             'results_count', 'in_bookmarks', 'user_name', 'user_avatar', 'user_bio', 'feedbacks')
        serializer = self.get_serializer(instance, fields=serializer_fields)
        return Response(serializer.data)

    @action(detail=False, url_path='created', url_name='created', ordering='-created', search_fields=['title'])
    def get_created_tests(self, request):
        """Возвращает список тестов, которые создал пользователь"""
        user_tests = self.queryset.filter(user=request.user)
        queryset = self.filter_queryset(user_tests)
        page = self.paginate_queryset(queryset)
        serializer_fields = ('id', 'title', 'avatar', 'is_published')
        serializer = self.get_serializer(page, many=True, fields=serializer_fields)
        return self.get_paginated_response(serializer.data)

    @action(detail=False, url_path='user/(?P<user_pk>[^/.]+)', url_name='user', ordering='-created',
            search_fields=['title'])
    def get_user_tests(self, request, **kwargs):
        """Возвращает список тестов, которые пользователь прошел или еще проходит"""
        user_tests = self.queryset.filter(results__user=kwargs['user_pk'])
        is_finished = self.request.query_params.get('is_finished')
        if is_finished == 'True':
            user_tests = user_tests.filter(results__total__isnull=False)
        elif is_finished == 'False':
            user_tests = user_tests.filter(~Q(results__total__isnull=False))
        queryset = self.filter_queryset(user_tests)
        page = self.paginate_queryset(queryset)
        serializer_fields = ('id', 'title', 'avatar')
        serializer = self.get_serializer(page, many=True, fields=serializer_fields)
        return self.get_paginated_response(serializer.data)

    @action(detail=True, url_path='description', url_name='description')
    def get_test_description(self, request, **kwargs):
        """Возвращает описание теста"""
        test = self.get_object()
        serializer_fields = ('title', 'description', 'full_description', 'avatar')
        serializer = self.get_serializer(test, fields=serializer_fields)
        return Response(serializer.data)

    @action(detail=True, url_path='questions', url_name='questions')
    def get_test_questions(self, request, **kwargs):
        """Возвращает название теста, публикацию и список вопросов с ответами"""
        test = self.get_object()
        serializer_fields = ('title', 'is_published', 'question_set')
        serializer = self.get_serializer(test, fields=serializer_fields)
        return Response(serializer.data)

    @action(detail=True, url_path='feedbacks', url_name='feedbacks', ordering='-created', ordering_fields=['created'])
    def get_test_feedbacks(self, request, **kwargs):
        """Возвращает отзывы теста"""
        test = self.get_object()
        feedbacks = test.feedbacks.all()
        page = self.paginate_queryset(feedbacks)
        serializer = FeedbackSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)


class QuestionAPIView(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    queryset = Question.objects
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated, IsQuestionAuthor]

