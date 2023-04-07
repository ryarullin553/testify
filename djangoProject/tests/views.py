from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from tests.models import *
from tests.serializers import *
from rest_framework import viewsets
from users.models import MyUser


class CatalogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Test.objects.all()
    serializer_class = CatalogSerializer


class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer


class TestQuestionViewSet(viewsets.ModelViewSet):
    queryset = TestQuestion.objects.all()
    serializer_class = TestQuestionSerializer

    def get_test(self):
        test_pk = self.kwargs.get('test_pk')
        return get_object_or_404(Test, pk=test_pk)

    def perform_create(self, serializer):
        test = self.get_test()
        serializer.save(test=test)


class TestAnswerViewSet(viewsets.ModelViewSet):
    queryset = TestAnswer.objects.all()
    serializer_class = TestAnswerSerializer

    def get_question(self):
        question_pk = self.kwargs.get('question_pk')
        return get_object_or_404(TestQuestion, pk=question_pk)

    def perform_create(self, serializer):
        question = self.get_question()
        serializer.save(question=question)


class TestResultViewSet(viewsets.ModelViewSet):
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializer

    def create(self, request, *args, **kwargs):
        test = get_object_or_404(Test, pk=kwargs.get('test_pk'))
        user = get_object_or_404(MyUser, pk=request.user.pk)

        result = TestResult.objects.create(test=test, user=user)
        serializer = self.get_serializer(result)
        return Response(serializer.data)


class TestResultAnswerViewSet(viewsets.ModelViewSet):
    queryset = TestResultAnswer.objects.all()
    serializer_class = TestResultAnswerSerializer

    def get_test_result(self):
        test_pk = self.kwargs.get('test_pk')
        result_pk = self.kwargs.get('result_pk')
        return get_object_or_404(TestResult, pk=result_pk, test__pk=test_pk)

    def perform_create(self, serializer):
        result = self.get_test_result()
        serializer.save(test_result=result)

    def list(self, request, *args, **kwargs):
        result = self.get_test_result()
        questions = TestQuestion.objects.filter(test=result.test)
        serializer = TestQuestionSerializer(questions, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        result = self.get_test_result()
        question = get_object_or_404(TestQuestion, pk=request.data.get('question'))
        answer = get_object_or_404(TestAnswer, pk=request.data.get('answer'))
        result_answer = TestResultAnswer.objects.create(test_result=result, question=question, answer=answer)
        serializer = self.get_serializer(result_answer)
        return Response(serializer.data)


class TestResultSummaryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TestResultSummarySerializer

    def get_test_result(self):
        test_pk = self.kwargs.get('test_pk')
        result_pk = self.kwargs.get('result_pk')
        return get_object_or_404(TestResult, pk=result_pk, test__pk=test_pk)

    def retrieve(self, request, *args, **kwargs):
        result = self.get_test_result()
        questions = TestQuestion.objects.filter(test=result.test)
        correct_answers = 0
        for question in questions:
            user_answer = TestResultAnswer.objects.filter(test_result=result, question=question).first()
            if user_answer and user_answer.answer == question.correct_answer:
                correct_answers += 1

        total_questions = questions.count()
        percent_correct = (correct_answers / total_questions) * 100 if total_questions > 0 else 0

        data = {
            'total_questions': total_questions,
            'correct_answers': correct_answers,
            'percent_correct': percent_correct
        }

        serializer = self.get_serializer(data)
        return Response(serializer.data)
