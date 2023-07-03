import json

from django.db import connection
from django.test.utils import CaptureQueriesContext
from rest_framework import status
from rest_framework.exceptions import ErrorDetail
from rest_framework.test import APITestCase

from answers.models import Answer
from passages.models import Passage
from questions.models import Question
from tests.models import Test
from users.models import User


class AnswerAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='user',
            email='user@mail.ru',
            password='123'
        )
        self.user_2 = User.objects.create_user(
            username='user2',
            email='user2@mail.ru',
            password='123'
        )
        self.test = Test.objects.create(
            title='Тест от пользователя',
            short_description='Опубликованный тест с описанием от пользователя',
            description='Описание теста',
            user=self.user,
            is_published=True,
            has_questions_explanation=True
        )
        self.test_without_points = Test.objects.create(
            title='Тест от пользователя',
            short_description='Опубликованный тест с описанием от пользователя',
            description='Описание теста',
            user=self.user,
            is_published=True,
            has_points=False
        )
        self.test_not_published = Test.objects.create(
            title='Неопубликованный тест',
            short_description='Неопубликованный тест с описанием от пользователя',
            user=self.user,
        )
        self.passage = Passage.objects.create(
            test=self.test,
            user=self.user_2
        )
        self.passage_2 = Passage.objects.create(
            test=self.test,
            user=self.user_2
        )
        self.finished_passage = Passage.objects.create(
            test=self.test,
            user=self.user_2,
            result={
                'questions_count': 2,
                'total_answers': 2,
                'correct_answers': 1,
                'time': '00:00:00',
                'score': 50,
            }
        )
        self.question_1 = Question.objects.create(
            test_id=self.test.id,
            type='Single choice',
            content='Содержание первого вопроса',
            answer_choices=[
                'Первый ответ',
                'Второй ответ',
                'Третий ответ',
                'Четвертый ответ'
            ],
            right_answers=[
                'Первый ответ'
            ],
            points=2,
            explanation='Пояснение к вопросу'
        )

        self.question_2 = Question.objects.create(
            test_id=self.test.id,
            type='Single choice',
            content='Содержание второго вопроса',
            answer_choices=[
                'Первый ответ',
                'Второй ответ',
                'Третий ответ',
                'Четвертый ответ'
            ],
            right_answers=[
                'Третий ответ'
            ],
            points=5,
        )
        self.question_3 = Question.objects.create(
            test_id=self.test_without_points.id,
            type='Single choice',
            content='Содержание второго вопроса',
            answer_choices=[
                'Первый ответ',
                'Второй ответ',
                'Третий ответ',
                'Четвертый ответ'
            ],
            right_answers=[
                'Третий ответ'
            ],
            points=5,
        )
        self.answer = Answer.objects.create(
            content=[
                'Первый ответ'
            ],
            question=self.question_2,
            passage=self.passage
        )

    def test_create(self):
        self.assertEqual(1, Answer.objects.count())
        url = '/api/answers/'
        data = {
            'content': [
                'Первый ответ'
            ],
            'question': self.question_1.id,
            'passage': self.passage.id
        }
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(6, len(queries))
        instance = Answer.objects.first()
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(2, Answer.objects.count())
        self.assertEqual(data['content'], instance.content)

    def test_create_not_unique_for_passage(self):
        self.assertEqual(1, Answer.objects.count())
        self.test_create()
        url = '/api/answers/'
        data = {
            'content': [
                'Первый ответ'
            ],
            'question': self.question_1.id,
            'passage': self.passage.id
        }
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(5, len(queries))
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        expected_detail = {
            'non_field_errors': [ErrorDetail(
                string='Поля passage, question должны производить массив с уникальными значениями.',
                code='unique'
            )]
        }
        self.assertEqual(expected_detail, response.data)
        self.assertEqual(2, Answer.objects.count())

    def test_create_not_test_relation(self):
        self.assertEqual(1, Answer.objects.count())
        url = '/api/answers/'
        data = {
            'content': [
                'Первый ответ'
            ],
            'question': self.question_3.id,
            'passage': self.passage.id
        }
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(5, len(queries))
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        expected_detail = {
            'detail': [ErrorDetail(
                string='Прохождение и вопрос должны относиться к одному тесту',
                code='invalid'
            )]
        }
        self.assertEqual(expected_detail, response.data)
        self.assertEqual(1, Answer.objects.count())

    def test_create_not_passage_user(self):
        self.assertEqual(1, Answer.objects.count())
        url = '/api/answers/'
        data = {
            'content': [
                'Первый ответ'
            ],
            'question': self.question_1.id,
            'passage': self.passage.id
        }
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(5, len(queries))
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        expected_detail = {
            'detail': [ErrorDetail(
                string='Текущий пользователь не является инициатором прохождения',
                code='invalid'
            )]
        }
        self.assertEqual(expected_detail, response.data)
        self.assertEqual(1, Answer.objects.count())

    def test_create_not_passage_result(self):
        self.assertEqual(1, Answer.objects.count())
        url = '/api/answers/'
        data = {
            'content': [
                'Первый ответ'
            ],
            'question': self.question_1.id,
            'passage': self.finished_passage.id
        }
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(5, len(queries))
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        expected_detail = {
            'detail': [ErrorDetail(
                string='Прохождение уже завершено',
                code='invalid'
            )]
        }
        self.assertEqual(expected_detail, response.data)
        self.assertEqual(1, Answer.objects.count())

    def test_update(self):
        url = f'/api/answers/{self.answer.id}/'
        data = {
            'content': [
                'Второй ответ'
            ],
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.patch(url, data=json_data, content_type='application/json')
            self.assertEqual(7, len(queries))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.answer.refresh_from_db()
        self.assertEqual(data['content'], self.answer.content)

    def test_update_not_passage_user(self):
        url = f'/api/answers/{self.answer.id}/'
        data = {
            'content': [
                'Второй ответ'
            ],
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.patch(url, data=json_data, content_type='application/json')
            self.assertEqual(4, len(queries))
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)

    def test_update_question(self):
        url = f'/api/answers/{self.answer.id}/'
        data = {
            'content': [
                'Второй ответ'
            ],
            'question': self.question_1.id
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.patch(url, data=json_data, content_type='application/json')
            self.assertEqual(6, len(queries))
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        expected_detail = {
            'detail': ErrorDetail(
                string='Можно изменять только содержание ответа',
                code='invalid'
            )
        }
        self.assertEqual(expected_detail, response.data)

    def test_update_passage(self):
        url = f'/api/answers/{self.answer.id}/'
        data = {
            'content': [
                'Второй ответ'
            ],
            'passage': self.passage_2.id
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.patch(url, data=json_data, content_type='application/json')
            self.assertEqual(7, len(queries))
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        expected_detail = {
            'detail': ErrorDetail(
                string='Можно изменять только содержание ответа',
                code='invalid'
            )
        }
        self.assertEqual(expected_detail, response.data)

    def test_delete(self):
        self.assertEqual(1, Answer.objects.count())
        url = f'/api/answers/{self.answer.id}/'
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.delete(url)
            self.assertEqual(5, len(queries))
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertEqual(0, Answer.objects.count())

    def test_delete_not_passage_user(self):
        self.assertEqual(1, Answer.objects.count())
        url = f'/api/answers/{self.answer.id}/'
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.delete(url)
            self.assertEqual(4, len(queries))
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)
        self.assertEqual(1, Answer.objects.count())

