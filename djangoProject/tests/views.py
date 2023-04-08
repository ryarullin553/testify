from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from tests.models import *
from tests.serializers import *
from rest_framework import viewsets
from users.models import MyUser


class CatalogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer


class CreateTestAPIView(APIView):
    def get(self, request):
        author = request.user
        author_tests = Test.objects.filter(author__pk=author.pk)
        serializer = TestSerializer(author_tests, many=True)
        return Response(serializer.data)

    def post(self, request):
        author = request.user
        request.data['author'] = author.pk
        serializer = TestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, **kwargs):
        pk = kwargs.get("pk", None)
        instance = self.get_instance(pk)
        serializer = TestSerializer(data=request.data, instance=instance)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, **kwargs):
        pk = kwargs.get("pk", None)
        instance = self.get_instance(pk)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @staticmethod
    def get_instance(pk):
        if not pk:
            return Response('Отсутствует id в url запросе')
        try:
            instance = Test.objects.get(pk=pk)
        except Test.DoesNotExist:
            return Response('Данного id не существует')
        return instance


class CreateTestQuestionAPIView(APIView):

    @staticmethod
    def get_instance(pk):
        if not pk:
            return Response('Отсутствует id в url запросе')
        try:
            instance = TestQuestion.objects.get(pk=pk)
        except Test.DoesNotExist:
            return Response('Данного id не существует')
        return instance

    @staticmethod
    def serialize_data(model_serializer, data, instance=None):
        serializer = model_serializer(data=data, instance=instance)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer

    @staticmethod
    def get_question_data(request):
        question_data = dict()
        question_data['content'] = request.data['question']
        question_data['test'] = request.data['test_id']
        return question_data

    def post(self, request):
        question_data = self.get_question_data(request)
        question_serializer = self.serialize_data(TestQuestionSerializer, question_data)
        question_pk = question_serializer.instance.pk

        answers_data = request.data['answers']
        for answer_data in answers_data:
            answer_data['question'] = question_pk
            self.serialize_data(TestAnswerSerializer, answer_data)

        return Response(question_serializer.data)

    def put(self, request, **kwargs):
        pk = kwargs.get("pk", None)
        question = self.get_instance(pk)
        question_data = self.get_question_data(request)
        question_serializer = self.serialize_data(TestQuestionSerializer, question_data, question)

        answers = TestAnswer.objects.filter(question__pk=pk)
        answers_data = request.data['answers']

        for i in range(len(answers)):
            answers_data[i]['question'] = pk
            self.serialize_data(TestAnswerSerializer, answers_data[i], answers[i])

        return Response(question_serializer.data)
