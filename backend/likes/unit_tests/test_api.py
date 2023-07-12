import json

from django.db import connection
from django.test.utils import CaptureQueriesContext
from rest_framework import status
from rest_framework.exceptions import ErrorDetail
from rest_framework.test import APITestCase

from likes.models import Like
from questions.models import Question
from tests.models import Test
from users.models import User


class LikeAPITestCase(APITestCase):
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
        self.like_1 = Like.objects.create(
            user_id=self.user_2.id,
            question_id=self.question_1.id,
            is_like=True
        )

    def test_create(self):
        self.assertEqual(1, Like.objects.count())
        url = '/api/likes/'
        data = {
            'question': self.question_1.id,
            'is_like': True
        }
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(5, len(queries))
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(2, Like.objects.count())

    def test_create_not_unique_question_and_user(self):
        self.assertEqual(1, Like.objects.count())
        url = '/api/likes/'
        data = {
            'question': self.question_1.id,
            'is_like': True
        }
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(4, len(queries))
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        expected_detail = {
            'non_field_errors': [ErrorDetail(
                string='Поля user, question должны производить массив с уникальными значениями.',
                code='unique'
            )]
        }
        self.assertEqual(expected_detail, response.data)
        self.assertEqual(1, Like.objects.count())

    def test_partial_update(self):
        url = f'/api/likes/{self.question_1.id}/'
        data = {
            'is_like': False
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.patch(url, data=json_data, content_type='application/json')
            self.assertEqual(7, len(queries))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.like_1.refresh_from_db()
        self.assertEqual(data['is_like'], self.like_1.is_like)

    def test_partial_update_not_user(self):
        url = f'/api/likes/{self.question_1.id}/'
        data = {
            'is_like': False
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.patch(url, data=json_data, content_type='application/json')
            self.assertEqual(3, len(queries))
        self.assertEqual(status.HTTP_404_NOT_FOUND, response.status_code)
        expected_detail = {
            'detail': ErrorDetail(
                string='Страница не найдена.',
                code='not_found'
            )
        }
        self.assertEqual(expected_detail, response.data)
        self.like_1.refresh_from_db()
        self.assertNotEqual(data['is_like'], self.like_1.is_like)

    def test_delete(self):
        self.assertEqual(1, Like.objects.count())
        url = f'/api/likes/{self.question_1.id}/'
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.delete(url)
            self.assertEqual(4, len(queries))
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertEqual(0, Like.objects.count())

    def test_delete_not_user(self):
        self.assertEqual(1, Like.objects.count())
        url = f'/api/likes/{self.question_1.id}/'
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.delete(url)
            self.assertEqual(3, len(queries))
        self.assertEqual(status.HTTP_404_NOT_FOUND, response.status_code)
        self.assertEqual(1, Like.objects.count())
