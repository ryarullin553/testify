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
    permission_classes = (IsAuthenticated, )

    def get(self, request, **kwargs):
        if not kwargs:
            author = request.user
            author_tests = Test.objects.filter(author__pk=author.pk)
            test_serializer = TestSerializer(author_tests, many=True)
        else:
            test_pk = kwargs.get('test_pk', None)
            instance = self.get_instance(test_pk, Test)
            test_serializer = TestSerializer(instance)
        return Response(test_serializer.data)

    def post(self, request):
        author = request.user
        request.data['author'] = author.pk
        test_serializer = self.serialize_data(TestSerializer, request.data)
        return Response(test_serializer.data)

    def put(self, request, **kwargs):
        test_pk = kwargs.get('test_pk', None)
        instance = self.get_instance(test_pk, Test)
        test_serializer = self.serialize_data(TestSerializer, request.data, instance, partial=True)
        return Response(test_serializer.data)

    def delete(self, request, **kwargs):
        test_pk = kwargs.get('test_pk', None)
        test = self.get_instance(test_pk, Test)
        delete_pk = test.pk
        test.delete()
        return Response(f"Тест №{delete_pk} успешно удален")


class QuestionAPIView(APIView, APIViewMixin):

    def get(self, request, **kwargs):
        test_pk = kwargs.get('test_pk', None)
        test = self.get_instance(test_pk, Test)
        questions = Question.objects.filter(test=test)
        questions_data = []

        for question in questions:
            question_serializer = QuestionSerializer(question)
            questions_data.append(question_serializer.data)

        response_data = {'test_title': test.title, 'questions': questions_data}
        return Response(response_data)

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

