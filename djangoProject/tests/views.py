from collections import OrderedDict
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from tests.mixins import APIViewMixin
from tests.models import *
from tests.serializers import *
from rest_framework import viewsets


class CatalogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer


class TestAPIView(APIView, APIViewMixin):
    def get(self, request, **kwargs):
        if not kwargs:
            author = request.user
            author_tests = Test.objects.filter(author=author)
            serializer = TestSerializer(author_tests, many=True)
        else:
            test_pk = kwargs.get('test_pk', None)
            instance = self.get_instance(test_pk, Test)
            serializer = TestSerializer(instance)
        return Response(serializer.data)

    def post(self, request):
        author = request.user
        request.data['author'] = author.pk
        print(request.data)
        serializer = self.serialize_data(TestSerializer, request.data)
        return Response(serializer.data)

    def put(self, request, **kwargs):
        test_pk = kwargs.get('test_pk', None)
        instance = self.get_instance(test_pk, Test)
        serializer = self.serialize_data(TestSerializer, request.data, instance, partial=True)
        return Response(serializer.data)

    def delete(self, request, **kwargs):
        pk = kwargs.get('test_pk', None)
        instance = self.get_instance(pk, Test)
        instance.delete()
        return Response('Тест успешно удален')


class QuestionAPIView(APIView, APIViewMixin):

    def get(self, request, **kwargs):
        test_pk = kwargs.get('test_pk', None)
        test = self.get_instance(test_pk, Test)
        questions = Question.objects.filter(test=test)
        response_data = []
        questions_response = []

        for question in questions:
            answers = question.answer_set.all()
            question_serializer = QuestionSerializer(question)
            answers_serializer = TestAnswerSerializer(answers, many=True)
            questions_response.append(OrderedDict([('question', question_serializer.data), ('answers', answers_serializer.data)]))

        response_data.append(OrderedDict([('test_title', test.title), ('questions', questions_response)]))
        return Response(response_data)

    def post(self, request, **kwargs):
        test_pk = kwargs.get('test_pk', None)
        test = self.get_instance(test_pk, Test)
        question_data = self.get_question_data(request, test)
        question_serializer = self.serialize_data(QuestionSerializer, question_data)
        question_pk = question_serializer.instance.pk
        response_data = [question_serializer.data]

        answers_data = request.data['answers']
        for answer_data in answers_data:
            answer_data['question'] = question_pk
            answer_serializer = self.serialize_data(TestAnswerSerializer, answer_data)
            response_data.append(answer_serializer.data)

        return Response(response_data)

    def put(self, request, **kwargs):
        question_pk = kwargs.get('question_pk', None)
        question = self.get_instance(question_pk, Question)
        question_data = self.get_question_data(request, question.test)
        question_serializer = self.serialize_data(QuestionSerializer, question_data, question)
        response_data = self.update_answers(request, question)
        response_data.insert(0, question_serializer.data)
        return Response(response_data)

    def delete(self, request, **kwargs):
        question_pk = kwargs.get('question_pk', None)
        question = self.get_instance(question_pk, Question)
        question.delete()
        return Response('Вопрос успешно удален')

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
        response_data = []

        for i in range(len(answers_data)):
            answers_data[i]['question'] = question.pk
            try:
                answer_serializer = self.serialize_data(TestAnswerSerializer, answers_data[i], question_answers[i])
                response_data.append(answer_serializer.data)
            except IndexError:
                answer_serializer = self.serialize_data(TestAnswerSerializer, answers_data[i])
                response_data.append(answer_serializer.data)

        number_of_answers_to_delete = len(question_answers) - len(answers_data)
        for i in range(number_of_answers_to_delete):
            question_answers.last().delete()

        return response_data
