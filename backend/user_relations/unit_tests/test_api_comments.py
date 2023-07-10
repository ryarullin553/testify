import json
import time
from pathlib import Path

from django.db import connection
from django.test.utils import CaptureQueriesContext
from django.core.files.uploadedfile import SimpleUploadedFile
from pytz import timezone
from rest_framework import status
from rest_framework.exceptions import ErrorDetail
from rest_framework.test import APITestCase

from questions.models import Question
from user_relations.models import Comment
from users.models import User
from tests.models import Test


class CommentAPITestCase(APITestCase):
    def setUp(self):
        path = Path('media', 'tests', 'logo.png')
        with open(path, "rb") as f:
            self.image = SimpleUploadedFile('logo.png', f.read(), content_type='image/png')

        self.user = User.objects.create_user(
            username='user',
            email='user@mail.ru',
            password='123',
            avatar=self.image
        )
        self.user_2 = User.objects.create_user(
            username='user2',
            email='user2@mail.ru',
            password='123',
        )
        self.test_with_image = Test.objects.create(
            title='Тест с аватаркой',
            short_description='Опубликованный тест с описанием и аватаркой от пользователя',
            description='Описание теста',
            user=self.user,
            image=self.image,
            is_published=True
        )
        self.question_1 = Question.objects.create(
            test_id=self.test_with_image.id,
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
            explanation='Пояснение к вопросу',
            image=self.image
        )
        self.comment_1 = Comment.objects.create(
            content='Первый комментарий к вопросу',
            question=self.question_1,
            user=self.user
        )
        time.sleep(0.1)
        self.comment_2 = Comment.objects.create(
            content='Второй комментарий к вопросу',
            question=self.question_1,
            user=self.user_2
        )
        self.comment_3 = Comment.objects.create(
            content='Первый комментарий к комментарию',
            comment=self.comment_2,
            user=self.user
        )
        time.sleep(0.1)
        self.comment_4 = Comment.objects.create(
            content='Второй комментарий к комментарию',
            comment=self.comment_2,
            user=self.user_2
        )

    def test_comments(self):
        url = f'/api/questions/{self.question_1.id}/comments/'
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(3, len(queries))
        response_data = response.data['results']
        expected_comment_1 = {
            'id': self.comment_1.id,
            'user_id': self.user.id,
            'user_name': 'user',
            'user_avatar': f'http://testserver/media/{self.user.avatar}',
            'created': self.comment_1.created.astimezone(timezone('Europe/Moscow')).isoformat(),
            'content': 'Первый комментарий к вопросу'
        }
        expected_comment_2 = {
            'id': self.comment_2.id,
            'user_id': self.user_2.id,
            'user_name': 'user2',
            'user_avatar': None,
            'created': self.comment_2.created.astimezone(timezone('Europe/Moscow')).isoformat(),
            'content': 'Второй комментарий к вопросу'
        }
        expected_data = [
            expected_comment_2,
            expected_comment_1
        ]
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(expected_data, response_data)

    def test_replies(self):
        url = f'/api/comments/{self.comment_2.id}/replies/'
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(3, len(queries))
        response_data = response.data['results']
        expected_comment_3 = {
            'id': self.comment_3.id,
            'user_id': self.user.id,
            'user_name': 'user',
            'user_avatar': f'http://testserver/media/{self.user.avatar}',
            'created': self.comment_3.created.astimezone(timezone('Europe/Moscow')).isoformat(),
            'content': 'Первый комментарий к комментарию'
        }
        expected_comment_4 = {
            'id': self.comment_4.id,
            'user_id': self.user_2.id,
            'user_name': 'user2',
            'user_avatar': None,
            'created': self.comment_4.created.astimezone(timezone('Europe/Moscow')).isoformat(),
            'content': 'Второй комментарий к комментарию'
        }
        expected_data = [
            expected_comment_4,
            expected_comment_3
        ]
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(expected_data, response_data)

    def test_create_question_comment(self):
        self.assertEqual(4, Comment.objects.count())
        url = '/api/comments/'
        data = {
            'question': self.question_1.id,
            'content': 'Новый комментарий к вопросу'
        }
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(4, len(queries))
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(5, Comment.objects.count())

    def test_create_comment_comment(self):
        self.assertEqual(4, Comment.objects.count())
        url = '/api/comments/'
        data = {
            'comment': self.comment_1.id,
            'content': 'Новый комментарий к комментарию'
        }
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(4, len(queries))
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(5, Comment.objects.count())
        created_comment = Comment.objects.last()
        self.assertEqual(data['content'], created_comment.content)

    def test_partial_update(self):
        url = f'/api/comments/{self.comment_1.id}/'
        data = {
            'content': 'Измененный комментарий к тесту'
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.patch(url, data=json_data, content_type='application/json')
            self.assertEqual(4, len(queries))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.comment_1.refresh_from_db()
        self.assertEqual(data['content'], self.comment_1.content)

    def test_partial_update_not_user(self):
        url = f'/api/comments/{self.comment_1.id}/'
        data = {
            'content': 'Измененный комментарий к тесту'
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.patch(url, data=json_data, content_type='application/json')
            self.assertEqual(3, len(queries))
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)

    def test_delete(self):
        self.assertEqual(4, Comment.objects.count())
        url = f'/api/comments/{self.comment_1.id}/'
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.delete(url)
            self.assertEqual(6, len(queries))
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertEqual(3, Comment.objects.count())

    def test_delete_not_user(self):
        self.assertEqual(4, Comment.objects.count())
        url = f'/api/comments/{self.comment_1.id}/'
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.delete(url)
            self.assertEqual(3, len(queries))
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)
        self.assertEqual(4, Comment.objects.count())

    def tearDown(self):
        self.test_with_image.image.delete()
        self.question_1.image.delete()
        self.user.avatar.delete()
