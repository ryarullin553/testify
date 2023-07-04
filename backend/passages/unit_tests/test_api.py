import json
import time

from django.db import connection
from django.test.utils import CaptureQueriesContext
from rest_framework import status
from rest_framework.exceptions import ErrorDetail
from rest_framework.test import APITestCase

from passages.models import Passage
from questions.models import Question
from tests.models import Test
from users.models import User


class PassageAPITestCase(APITestCase):
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
        time.sleep(0.1)
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
        self.passage_test_without_points = Passage.objects.create(
            test=self.test_without_points,
            user=self.user_2
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

    def test_retrieve(self):
        url = f'/api/passages/{self.passage.id}/'
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(5, len(queries))
        expected_passage = {
            'id': self.passage.id,
            'test': self.test.id,
            'test_data': {
                'questions': [
                    {
                        'id': self.question_1.id,
                        'type': 'Single choice',
                        'content': 'Содержание первого вопроса',
                        'answer_choices': [
                            'Первый ответ',
                            'Второй ответ',
                            'Третий ответ',
                            'Четвертый ответ'
                        ],
                        'points': 2,
                        'image': None
                    },
                    {
                        'id': self.question_2.id,
                        'type': 'Single choice',
                        'content': 'Содержание второго вопроса',
                        'answer_choices': [
                            'Первый ответ',
                            'Второй ответ',
                            'Третий ответ',
                            'Четвертый ответ'
                        ],
                        'points': 5,
                        'image': None
                    }
                ],
                'title': 'Тест от пользователя',
            },
            'answers': [],
            'result': None
        }
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data, expected_passage)

    def test_retrieve_without_points(self):
        url = f'/api/passages/{self.passage_test_without_points.id}/'
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(5, len(queries))
        expected_passage = {
            'id': self.passage_test_without_points.id,
            'test': self.test_without_points.id,
            'test_data': {
                'questions': [
                    {
                        'id': self.question_3.id,
                        'type': 'Single choice',
                        'content': 'Содержание второго вопроса',
                        'answer_choices': [
                            'Первый ответ',
                            'Второй ответ',
                            'Третий ответ',
                            'Четвертый ответ'
                        ],
                        'image': None
                    }
                ],
                'title': 'Тест от пользователя',
            },
            'answers': [],
            'result': None
        }
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data, expected_passage)

    def test_retrieve_finished(self):
        url = f'/api/passages/{self.finished_passage.id}/'
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(5, len(queries))
        expected_passage = {
            'id': self.finished_passage.id,
            'test': self.test.id,
            'test_data': {
                'questions': [
                    {
                        'id': self.question_1.id,
                        'type': 'Single choice',
                        'content': 'Содержание первого вопроса',
                        'answer_choices': [
                            'Первый ответ',
                            'Второй ответ',
                            'Третий ответ',
                            'Четвертый ответ'
                        ],
                        'right_answers': [
                            'Первый ответ'
                        ],
                        'points': 2,
                        'explanation': 'Пояснение к вопросу',
                        'image': None
                    },
                    {
                        'id': self.question_2.id,
                        'type': 'Single choice',
                        'content': 'Содержание второго вопроса',
                        'answer_choices': [
                            'Первый ответ',
                            'Второй ответ',
                            'Третий ответ',
                            'Четвертый ответ'
                        ],
                        'right_answers': [
                            'Третий ответ'
                        ],
                        'points': 5,
                        'explanation': '',
                        'image': None
                    }
                ],
                'title': 'Тест от пользователя',
            },
            'answers': [],
            'result': {
                'time': '00:00:00',
                'score': 50,
                'total_answers': 2,
                'correct_answers': 1,
                'questions_count': 2
            }
        }
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data, expected_passage)

    def test_create(self):
        self.assertEqual(3, Passage.objects.count())
        url = '/api/passages/'
        data = {
            'test': self.test.id
        }
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(6, len(queries))
        instance = Passage.objects.first()
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(4, Passage.objects.count())
        self.assertEqual(self.user_2, instance.user)
        self.assertEqual(None, instance.result)

    def test_create_not_published(self):
        self.assertEqual(3, Passage.objects.count())
        url = '/api/passages/'
        data = {
            'test': self.test_not_published.id
        }
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(3, len(queries))
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(3, Passage.objects.count())

    def test_update(self):
        url = f'/api/passages/{self.passage.id}/'
        data = {
            'result': {
                'questions_count': self.passage.test.questions.count(),
                'total_answers': 2,
                'correct_answers': 1,
                'time': '00:00:00',
                'score': 50,
            }
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.patch(url, data=json_data, content_type='application/json')
            self.assertEqual(6, len(queries))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.test.refresh_from_db()
        self.assertEqual(data['result'], response.data['result'])

    def test_update_not_user(self):
        url = f'/api/passages/{self.passage.id}/'
        data = {
            'result': {
                'questions_count': self.passage.test.questions.count(),
                'total_answers': 2,
                'correct_answers': 1,
                'time': '00:00:00',
                'score': 50,
            }
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.patch(url, data=json_data, content_type='application/json')
            self.assertEqual(3, len(queries))
        expected_detail = {
            'detail': ErrorDetail(
                string='У вас недостаточно прав для выполнения данного действия.',
                code='permission_denied'
            )
        }
        self.assertEqual(expected_detail, response.data)
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)
        self.test.refresh_from_db()
        self.assertEqual(None, self.passage.result)

    def test_update_test(self):
        url = f'/api/passages/{self.passage.id}/'
        data = {
            'test': self.test_without_points.id
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.patch(url, data=json_data, content_type='application/json')
            self.assertEqual(4, len(queries))
        expected_detail = {
            'detail': ErrorDetail(
                string='Тест уже завершен',
                code='invalid'
            )
        }
        self.assertEqual(expected_detail, response.data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.test.refresh_from_db()
        self.assertEqual(self.test, self.passage.test)

    def test_passages(self):
        url = f'/api/tests/{self.test.id}/passages/'
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(3, len(queries))
        expected_passage = {
            'id': self.passage.id,
            'result': None
        }
        expected_finished_passage = {
            'id': self.finished_passage.id,
            'result': {
                'questions_count': 2,
                'total_answers': 2,
                'correct_answers': 1,
                'time': '00:00:00',
                'score': 50,
            }
        }
        expected_data = [
            expected_finished_passage,
            expected_passage
        ]
        response_data = response.data['results']
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(expected_data, response_data)
