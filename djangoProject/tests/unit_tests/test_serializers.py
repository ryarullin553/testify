from django.test import TestCase
from ..models import Test, Answer, Question
from ..serializers import TestSerializer, QuestionSerializer, AnswerSerializer


class TestSerializerTestCase(TestCase):
    def test_ok(self):
        test_1 = Test.objects.create(title='Тест №1', description='Описание теста', full_description='Полное описание теста')
        test_2 = Test.objects.create(title='Тест №2', description='Описание теста', full_description='Полное описание теста')
        data = TestSerializer([test_1, test_2], many=True).data
        expected_data = [
            {
                'id': test_1.pk,
                'title': 'Тест №1',
                'description': 'Описание теста',
                'full_description': 'Полное описание теста',
                'avatar': None,
                'author': None,
                'is_published': False
            },
            {
                'id': test_2.pk,
                'title': 'Тест №2',
                'description': 'Описание теста',
                'full_description': 'Полное описание теста',
                'avatar': None,
                'author': None,
                'is_published': False
            }
        ]
        self.assertEqual(expected_data, data)


class AnswerSerializerTestCase(TestCase):  # тест-кейс написан, однако проблемы с запуском, есть проблемы с импортом
    def test_two(self):
        test_3 = Answer.objects.create(content = 'Ответ №1', is_true = 0)
        data = AnswerSerializer(test_3).data
        expected_data = [
                {
                    "content": "Ответ №1",
                    'question': test_3.pk,
                    "is_true": 0
                }]

        self.assertEqual(expected_data, data)


class QuestionSerializerTestCase(TestCase):
    def test_three(self):
        test_5 = Question.objects.create(content = 'Тут мог бы быть ваш тест')
        data = QuestionSerializer(test_5).data
        expected_data = [
            {
                'answer_set': None,
                'id': test_5.pk,
                'content': 'Тут мог бы быть ваш тест',
                'test': None

            }
        ]
        self.assertEqual(expected_data, data)