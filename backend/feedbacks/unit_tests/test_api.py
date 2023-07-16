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

from feedbacks.models import Feedback
from users.models import User
from tests.models import Test


class FeedbackAPITestCase(APITestCase):
    def setUp(self):
        path = Path('media', 'tests', 'logo.png')
        with open(path, "rb") as f:
            self.image = SimpleUploadedFile('logo.png', f.read(), content_type='image/png')

        self.user = User.objects.create_user(
            username='user',
            email='user@mail.ru',
            password='123',
            image=self.image
        )
        self.user_2 = User.objects.create_user(
            username='user2',
            email='user2@mail.ru',
            password='123'
        )
        self.user_3 = User.objects.create_user(
            username='user3',
            email='user3@mail.ru',
            password='123'
        )
        self.test_with_user = Test.objects.create(
            title='Тест от пользователя',
            short_description='Опубликованный тест с описанием от пользователя',
            description='Описание теста',
            user=self.user,
            is_published=True
        )
        self.feedback_1 = Feedback.objects.create(
            test=self.test_with_user,
            user=self.user,
            rate=4,
            content='Первый отзыв от тесте'
        )
        time.sleep(0.1)
        self.feedback_2 = Feedback.objects.create(
            test=self.test_with_user,
            user=self.user_2,
            rate=5,
            content='Второй отзыв от тесте'
        )

    def test_feedbacks(self):
        url = f'/api/tests/{self.test_with_user.id}/feedbacks/'
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(3, len(queries))
        response_data = response.data['results']
        expected_feedback_1 = {
            'rate': 4,
            'content': 'Первый отзыв от тесте',
            'user_id': self.user.id,
            'user_name': 'user',
            'created': self.feedback_1.created.astimezone(timezone('Europe/Moscow')).isoformat()
        }
        expected_feedback_2 = {
            'rate': 5,
            'content': 'Второй отзыв от тесте',
            'user_id': self.user_2.id,
            'user_name': 'user2',
            'created': self.feedback_2.created.astimezone(timezone('Europe/Moscow')).isoformat()
        }
        expected_data = [
            expected_feedback_2,
            expected_feedback_1
        ]
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(expected_data, response_data)

    def test_create(self):
        self.assertEqual(2, Feedback.objects.count())
        url = '/api/feedbacks/'
        data = {
            'test': self.test_with_user.id,
            'rate': 3,
            'content': 'Новый отзыв'
        }
        self.client.force_login(self.user_3)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(5, len(queries))
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(3, Feedback.objects.count())
        new_feedback = Feedback.objects.last()
        self.assertEqual(data['rate'], new_feedback.rate)
        self.assertEqual(data['content'], new_feedback.content)

    def test_create_not_unique_test_and_user(self):
        self.assertEqual(2, Feedback.objects.count())
        url = '/api/feedbacks/'
        data = {
            'test': self.test_with_user.id,
            'rate': 3,
            'content': 'Новый отзыв'
        }
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(4, len(queries))
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        expected_detail = {
            'non_field_errors': [ErrorDetail(
                string='Поля user, test должны производить массив с уникальными значениями.',
                code='unique'
            )]
        }
        self.assertEqual(expected_detail, response.data)
        self.assertEqual(2, Feedback.objects.count())

    def test_partial_update(self):
        url = f'/api/feedbacks/{self.test_with_user.id}/'
        data = {
            'rate': 5,
            'content': 'Измененный отзыв'
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.patch(url, data=json_data, content_type='application/json')
            self.assertEqual(7, len(queries))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.feedback_2.refresh_from_db()
        self.assertEqual(data['rate'], self.feedback_2.rate)
        self.assertEqual(data['content'], self.feedback_2.content)

    def test_partial_update_not_user(self):
        url = f'/api/feedbacks/{self.test_with_user.id}/'
        data = {
            'rate': 5,
            'content': 'Измененный отзыв'
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user_3)
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
        self.feedback_2.refresh_from_db()
        self.assertEqual(5, self.feedback_2.rate)
        self.assertEqual('Второй отзыв от тесте', self.feedback_2.content)

    def test_partial_update_test(self):
        test_2 = Test.objects.create(
            title='Тест от пользователя',
            short_description='Опубликованный тест с описанием от пользователя',
            description='Описание теста',
            user=self.user_2,
            is_published=True
        )
        url = f'/api/feedbacks/{self.test_with_user.id}/'
        data = {
            'test': test_2.id
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.patch(url, data=json_data, content_type='application/json')
            self.assertEqual(6, len(queries))
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        expected_detail = [ErrorDetail(
                string='Тест не может быть изменен',
                code='invalid'
            )]
        self.assertEqual(expected_detail, response.data)
        self.feedback_2.refresh_from_db()
        self.assertNotEqual(data['test'], self.feedback_2.test.id)

    def test_delete(self):
        self.assertEqual(2, Feedback.objects.count())
        url = f'/api/feedbacks/{self.test_with_user.id}/'
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.delete(url)
            self.assertEqual(4, len(queries))
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertEqual(1, Feedback.objects.count())

    def test_delete_not_user(self):
        self.assertEqual(2, Feedback.objects.count())
        url = f'/api/feedbacks/{self.test_with_user.id}/'
        self.client.force_login(self.user_3)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.delete(url)
            self.assertEqual(3, len(queries))
        self.assertEqual(status.HTTP_404_NOT_FOUND, response.status_code)
        self.assertEqual(2, Feedback.objects.count())

    def tearDown(self):
        self.user.image.delete()
