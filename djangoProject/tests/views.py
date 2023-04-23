from django.http import JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .mixins import APIViewMixin
from .models import *
from .paginations import TestPagination
from .permissions import *
from .serializers import *
from rest_framework import viewsets


class CatalogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Test.objects.filter(is_published=True)
    serializer_class = TestSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['time_create']
    pagination_class = TestPagination


class TestAPIView(GenericAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    lookup_url_kwarg = 'test_pk'
    permission_classes = (IsAuthenticated, IsTestAuthor)
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'description']
    filterset_fields = ['is_published']
    pagination_class = TestPagination

    def get(self, request, **kwargs):
        if not kwargs:
            author = request.user
            author_tests = Test.objects.filter(author__pk=author.pk)
            queryset = self.filter_queryset(author_tests)

            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
        else:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, **kwargs):
        test = self.get_object()
        test_title = test.title
        test.delete()
        return Response(f"Тест {test_title} успешно удален")


class QuestionAPIView(APIView, APIViewMixin):
    permission_classes = (IsAuthenticated, IsQuestionAuthor)

    def get(self, request, **kwargs):
        test_pk = kwargs.get('test_pk', None)
        test = self.get_instance(test_pk, Test)
        questions = Question.objects.filter(test=test)
        questions_data = []

        for question in questions:
            question_serializer = QuestionSerializer(question)
            questions_data.append(question_serializer.data)

        response_data = {'test_id': test.pk,
                         'test_title': test.title,
                         'is_published': test.is_published,
                         'questions': questions_data}

        return JsonResponse(response_data)

    def post(self, request, **kwargs):
        test_pk = kwargs.get('test_pk', None)
        test = self.get_instance(test_pk, Test)
        question_data = self.get_question_data(request, test)
        question_serializer = self.serialize_data(QuestionSerializer, question_data)
        question_pk = question_serializer.instance.pk

        answers_data = request.data['answers']
        for answer_data in answers_data:
            answer_data['question'] = question_pk
            self.serialize_data(AnswerSerializer, answer_data)

        question_serializer = QuestionSerializer(question_serializer.instance)
        return Response(question_serializer.data)

    def put(self, request, **kwargs):
        question_pk = kwargs.get('question_pk', None)
        question = self.get_instance(question_pk, Question)
        question_data = self.get_question_data(request, question.test)
        question_serializer = self.serialize_data(QuestionSerializer, question_data, question)
        self.update_answers(request, question)
        return Response(question_serializer.data)

    def delete(self, request, **kwargs):
        question_pk = kwargs.get('question_pk', None)
        question = self.get_instance(question_pk, Question)
        delete_pk = question.pk
        question.delete()
        return Response(f"Вопрос №{delete_pk} успешно удален")

    @staticmethod
    def get_question_data(request, test):
        question_data = dict()
        question_data['content'] = request.data['question']
        question_data['test'] = test.pk
        return question_data

    def update_answers(self, request, question):
        """Для изменения существующих ответов, а также добавления новых и удаления лишних"""
        answers_data = request.data['answers']
        question_answers = Answer.objects.filter(question=question)

        for i in range(len(answers_data)):
            answers_data[i]['question'] = question.pk
            try:
                self.serialize_data(AnswerSerializer, answers_data[i], question_answers[i])
            except IndexError:
                self.serialize_data(AnswerSerializer, answers_data[i])

        number_of_answers_to_delete = len(question_answers) - len(answers_data)
        for i in range(number_of_answers_to_delete):
            question_answers.last().delete()
