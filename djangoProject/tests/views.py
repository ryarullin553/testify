from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets

from .mixins import APIViewMixin
from .models import Test, Question
from .paginations import TestPagination
from .permissions import IsTestAuthor, IsQuestionAuthor
from .serializers import TestSerializer, QuestionSerializer


class CatalogAPIView(viewsets.ReadOnlyModelViewSet):
    queryset = Test.objects.filter(is_published=True)
    serializer_class = TestSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['time_create']
    pagination_class = TestPagination


class TestAPIView(viewsets.GenericViewSet, APIViewMixin):
    queryset = Test.objects
    serializer_class = TestSerializer
    permission_classes = (IsAuthenticated, IsTestAuthor)
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['title']
    filterset_fields = ['is_published']
    pagination_class = TestPagination

    def create_test(self, request):
        """Создает тест на основе переданного JSON"""
        serializer = self.get_saved_serializer(request.data)
        return Response(serializer.data['id'], status=status.HTTP_201_CREATED)

    def get_tests(self, request):
        """Возвращает список тестов, которые создал пользователь"""
        author = request.user
        author_tests = Test.objects.filter(author=author)
        queryset = self.filter_queryset(author_tests)
        page = self.paginate_queryset(queryset)
        serializer_fields = ('id', 'title', 'description', 'full_description', 'avatar', 'is_published')
        serializer = self.get_serializer(page, many=True, fields=serializer_fields)
        return self.get_paginated_response(serializer.data)

    @action(detail=True, url_path='description', url_name='description')
    def get_test_description(self, request, **kwargs):
        """Возвращает описание теста по переданному pk в url"""
        test = self.get_object()
        serializer_fields = ('title', 'description', 'full_description', 'avatar')
        serializer = self.get_serializer(test, fields=serializer_fields)
        return Response(serializer.data)

    @action(detail=True, url_path='questions', url_name='questions')
    def get_test_questions(self, request, **kwargs):
        """Возвращает название теста, публикацию и список вопросов с ответами по переданному pk в url"""
        test = self.get_object()
        serializer_fields = ('title', 'is_published', 'question_set')
        serializer = TestSerializer(test, fields=serializer_fields)
        return Response(serializer.data)

    def update_test_description(self, request, **kwargs):
        """Изменяет описание теста по переданному pk в url на основе переданного JSON"""
        test = self.get_object()
        self.get_saved_serializer(request.data, test, partial=True)
        return Response()

    def delete_test(self, request, **kwargs):
        """Удаляет тест по переданному pk в url"""
        test = self.get_object()
        test.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class QuestionAPIView(viewsets.GenericViewSet, APIViewMixin):
    queryset = Question.objects
    serializer_class = QuestionSerializer
    permission_classes = (IsAuthenticated, IsQuestionAuthor)

    def create_question(self, request):
        """Создает вопрос с ответами на основе переданного JSON"""
        self.get_saved_serializer(request.data)
        return Response(status=status.HTTP_201_CREATED)

    def update_question(self, request, **kwargs):
        """Обновляет вопрос и пересоздает его ответы на основе переданного JSON"""
        question = self.get_object()
        self.get_saved_serializer(request.data, question, partial=True)
        return Response()

    def delete_question(self, request, **kwargs):
        """Удаляет вопрос по переданному pk в url"""
        question = self.get_object()
        question.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
