import json
from pathlib import Path
import time
from pytz import timezone

from django.db import connection
from django.test.utils import CaptureQueriesContext
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.exceptions import ErrorDetail
from rest_framework.test import APITestCase

from passages.models import Passage
from questions.models import Question
from tests.models import Test
from users.models import User


class TestAPITestCase(APITestCase):
    def setUp(self):
        path = Path('media', 'tests', 'logo.png')
        with open(path, "rb") as f:
            self.image = SimpleUploadedFile('logo.png', f.read(), content_type='image/png')

        self.user = User.objects.create_user(
            username='user',
            email='user@mail.ru',
            password='123'
        )
        self.user_3 = User.objects.create_user(
            username='user3',
            email='user3@mail.ru',
            password='123'
        )
        self.simple_test = Test.objects.create(
            title='Простой тест',
            short_description='Тест только с необходимыми полями для создания',
        )

        self.simple_published_test = Test.objects.create(
            title='Простой тест',
            short_description='Опубликованный тест только с необходимыми полями для создания',
            is_published=True
        )
        time.sleep(0.1)

        self.test_with_description = Test.objects.create(
            title='Тест с описанием',
            short_description='Опубликованный тест с описанием',
            description='Описание теста',
            is_published=True
        )
        time.sleep(0.1)

        self.test_with_user = Test.objects.create(
            title='Тест от пользователя',
            short_description='Опубликованный тест с описанием от пользователя',
            description='Описание теста',
            user=self.user,
            is_published=True
        )
        time.sleep(0.1)

        self.test_with_image = Test.objects.create(
            title='Тест с аватаркой',
            short_description='Опубликованный тест с описанием и аватаркой от пользователя',
            description='Описание теста',
            user=self.user,
            image=self.image,
            is_published=True,
            has_questions_explanation=True
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

        self.question_2 = Question.objects.create(
            test_id=self.test_with_image.id,
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
            points=5
        )
        self.passage = Passage.objects.create(
            test=self.test_with_image,
            user=self.user
        )
        self.finished_passage = Passage.objects.create(
            test=self.test_with_image,
            user=self.user,
            result={
                'questions_count': 2,
                'total_answers': 2,
                'correct_answers': 1,
                'time': '00:00:00',
                'score': 50,
            }
        )

    def get_response_and_check_queries(self, url, expected_queries):
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(expected_queries, len(queries))
        return response

    def test_list(self):
        url = '/api/tests/'
        response = self.get_response_and_check_queries(url, expected_queries=1)
        response_data = response.data['results']
        expected_simple_published_test = {
            'id': self.simple_published_test.id,
            'rating': None,
            'feedbacks_count': 0,
            'results_count': 0,
            'in_bookmarks': False,
            'has_passage': False,
            'title': 'Простой тест',
            'short_description': 'Опубликованный тест только с необходимыми полями для создания',
            'image': None,
            'user': None
        }
        expected_test_with_description = {
            'id': self.test_with_description.id,
            'rating': None,
            'feedbacks_count': 0,
            'results_count': 0,
            'in_bookmarks': False,
            'has_passage': False,
            'title': 'Тест с описанием',
            'short_description': 'Опубликованный тест с описанием',
            'image': None,
            'user': None
        }
        expected_test_with_user = {
            'id': self.test_with_user.id,
            'rating': None,
            'feedbacks_count': 0,
            'results_count': 0,
            'user_name': 'user',
            'in_bookmarks': False,
            'has_passage': False,
            'title': 'Тест от пользователя',
            'short_description': 'Опубликованный тест с описанием от пользователя',
            'image': None,
            'user': self.user.id
        }
        expected_test_with_image = {
            'id': self.test_with_image.id,
            'rating': None,
            'feedbacks_count': 0,
            'results_count': 2,
            'user_name': 'user',
            'in_bookmarks': False,
            'has_passage': False,
            'title': 'Тест с аватаркой',
            'short_description': 'Опубликованный тест с описанием и аватаркой от пользователя',
            'image': f'http://testserver/media/{self.test_with_image.image}',
            'user': self.user.id
        }
        expected_data = [
            expected_test_with_image,
            expected_test_with_user,
            expected_test_with_description,
            expected_simple_published_test
        ]
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response_data, expected_data)

    def test_list_search(self):
        url = '/api/tests/?search=user'
        response = self.get_response_and_check_queries(url, expected_queries=1)
        response_data = response.data['results']
        expected_test_with_user = {
            'id': self.test_with_user.id,
            'rating': None,
            'feedbacks_count': 0,
            'results_count': 0,
            'user_name': 'user',
            'in_bookmarks': False,
            'has_passage': False,
            'title': 'Тест от пользователя',
            'short_description': 'Опубликованный тест с описанием от пользователя',
            'image': None,
            'user': self.user.id
        }
        expected_test_with_image = {
            'id': self.test_with_image.id,
            'rating': None,
            'feedbacks_count': 0,
            'results_count': 2,
            'user_name': 'user',
            'in_bookmarks': False,
            'has_passage': False,
            'title': 'Тест с аватаркой',
            'short_description': 'Опубликованный тест с описанием и аватаркой от пользователя',
            'image': f'http://testserver/media/{self.test_with_image.image}',
            'user': self.user.id
        }
        expected_data = [
            expected_test_with_image,
            expected_test_with_user
        ]
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response_data, expected_data)

    def test_list_ordering_created(self):
        url = '/api/tests/?ordering=created'
        response = self.get_response_and_check_queries(url, expected_queries=1)
        response_data = response.data['results']
        expected_simple_published_test = {
            'id': self.simple_published_test.id,
            'rating': None,
            'feedbacks_count': 0,
            'results_count': 0,
            'in_bookmarks': False,
            'has_passage': False,
            'title': 'Простой тест',
            'short_description': 'Опубликованный тест только с необходимыми полями для создания',
            'image': None,
            'user': None
        }
        expected_test_with_description = {
            'id': self.test_with_description.id,
            'rating': None,
            'feedbacks_count': 0,
            'results_count': 0,
            'in_bookmarks': False,
            'has_passage': False,
            'title': 'Тест с описанием',
            'short_description': 'Опубликованный тест с описанием',
            'image': None,
            'user': None
        }
        expected_test_with_user = {
            'id': self.test_with_user.id,
            'rating': None,
            'feedbacks_count': 0,
            'results_count': 0,
            'user_name': 'user',
            'in_bookmarks': False,
            'has_passage': False,
            'title': 'Тест от пользователя',
            'short_description': 'Опубликованный тест с описанием от пользователя',
            'image': None,
            'user': self.user.id
        }
        expected_test_with_image = {
            'id': self.test_with_image.id,
            'rating': None,
            'feedbacks_count': 0,
            'results_count': 2,
            'user_name': 'user',
            'in_bookmarks': False,
            'has_passage': False,
            'title': 'Тест с аватаркой',
            'short_description': 'Опубликованный тест с описанием и аватаркой от пользователя',
            'image': f'http://testserver/media/{self.test_with_image.image}',
            'user': self.user.id
        }
        expected_data = [
            expected_simple_published_test,
            expected_test_with_description,
            expected_test_with_user,
            expected_test_with_image
        ]
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response_data, expected_data)

    def test_list_filter(self):
        url = f'/api/tests/?user={self.user.id}'
        response = self.get_response_and_check_queries(url, expected_queries=2)
        response_data = response.data['results']
        expected_test_with_user = {
            'id': self.test_with_user.id,
            'rating': None,
            'feedbacks_count': 0,
            'results_count': 0,
            'user_name': 'user',
            'in_bookmarks': False,
            'has_passage': False,
            'title': 'Тест от пользователя',
            'short_description': 'Опубликованный тест с описанием от пользователя',
            'image': None,
            'user': self.user.id
        }
        expected_test_with_image = {
            'id': self.test_with_image.id,
            'rating': None,
            'feedbacks_count': 0,
            'results_count': 2,
            'user_name': 'user',
            'in_bookmarks': False,
            'has_passage': False,
            'title': 'Тест с аватаркой',
            'short_description': 'Опубликованный тест с описанием и аватаркой от пользователя',
            'image': f'http://testserver/media/{self.test_with_image.image}',
            'user': self.user.id
        }
        expected_data = [
            expected_test_with_image,
            expected_test_with_user
        ]
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response_data, expected_data)

    def test_create(self):
        self.assertEqual(5, Test.objects.count())
        url = '/api/tests/'
        data = {
            'title': 'Созданный тест',
            'short_description': 'Краткое описание теста',
            'description': 'Описание теста',
            'image': self.image.open(),
            'has_questions_explanation': True
        }
        self.client.force_login(self.user)
        response = self.client.post(url, data=data)
        instance = Test.objects.first()
        instance.image.delete()
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(6, Test.objects.count())
        self.assertEqual(self.user, instance.user)

    def test_update(self):
        url = f'/api/tests/{self.test_with_image.id}/'
        data = {
            'title': 'Обновленный тест',
            'description': 'Новое описание теста',
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user)
        response = self.client.patch(url, data=json_data, content_type='application/json')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.test_with_image.refresh_from_db()
        self.assertEqual(True, self.test_with_image.is_published)
        self.assertEqual('Обновленный тест', self.test_with_image.title)
        self.assertEqual('Новое описание теста', self.test_with_image.description)
        self.assertEqual(True, self.test_with_image.has_points)
        self.assertEqual(True, self.test_with_image.has_comments)

    def test_update_not_user(self):
        self.user_2 = User.objects.create_user(
            username='user2',
            email='user2@mail.ru',
            password='123'
        )
        url = f'/api/tests/{self.test_with_image.id}/'
        data = {
            'title': 'Обновленный тест',
            'description': 'Новое описание теста',
            'is_published': True,
            'has_point': True,
            'has_comments': True
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user_2)
        response = self.client.patch(url, data=json_data, content_type='application/json')
        expected_detail = {
            'detail': ErrorDetail(
                string='У вас недостаточно прав для выполнения данного действия.',
                code='permission_denied'
            )
        }
        self.assertEqual(expected_detail, response.data)
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)
        self.test_with_image.refresh_from_db()
        self.assertEqual('Тест с аватаркой', self.test_with_image.title)

    def test_delete(self):
        self.assertEqual(5, Test.objects.count())
        url = f'/api/tests/{self.test_with_image.id}/'
        self.client.force_login(self.user)
        response = self.client.delete(url)
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertEqual(4, Test.objects.count())

    def test_delete_not_user(self):
        self.user_2 = User.objects.create_user(
            username='user2',
            email='user2@mail.ru',
            password='123'
        )
        self.assertEqual(5, Test.objects.count())
        url = f'/api/tests/{self.test_with_image.id}/'
        self.client.force_login(self.user_2)
        response = self.client.delete(url)
        expected_detail = {
            'detail': ErrorDetail(
                string='У вас недостаточно прав для выполнения данного действия.',
                code='permission_denied'
            )
        }
        self.assertEqual(expected_detail, response.data)
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)
        self.assertEqual(5, Test.objects.count())

    def test_retrieve(self):
        url = f'/api/tests/{self.test_with_image.id}/'
        self.client.force_login(self.user)
        response = self.get_response_and_check_queries(url, expected_queries=3)
        expected_test_with_image = {
            'id': self.test_with_image.id,
            'rating': None,
            'feedbacks_count': 0,
            'results_count': 2,
            'user_name': 'user',
            'user_avatar': None,
            'user_bio': None,
            'in_bookmarks': False,
            'has_passage': True,
            'title': 'Тест с аватаркой',
            'short_description': 'Опубликованный тест с описанием и аватаркой от пользователя',
            'description': 'Описание теста',
            'image': f'http://testserver/media/{self.test_with_image.image}',
            'user': self.user.id
        }
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data, expected_test_with_image)

    def test_config(self):
        url = f'/api/tests/{self.test_with_image.id}/config/'
        self.client.force_login(self.user)
        response = self.get_response_and_check_queries(url, expected_queries=3)
        expected_test_with_image = {
            'id': self.test_with_image.id,
            'title': 'Тест с аватаркой',
            'short_description': 'Опубликованный тест с описанием и аватаркой от пользователя',
            'description': 'Описание теста',
            'image': f'http://testserver/media/{self.test_with_image.image}',
            'is_published': True,
            'has_points': True,
            'has_comments': True,
            'has_right_answers': True,
            'has_questions_explanation': True
        }
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data, expected_test_with_image)

    def test_created(self):
        url = f'/api/tests/created/'
        self.client.force_login(self.user)
        response = self.get_response_and_check_queries(url, expected_queries=3)
        response_data = response.data['results']
        expected_test_with_user = {
            'id': self.test_with_user.id,
            'title': 'Тест от пользователя',
            'image': None,
            'created': self.test_with_user.created.astimezone(timezone('Europe/Moscow')).isoformat(),
            'is_published': True
        }
        expected_test_with_image = {
            'id': self.test_with_image.id,
            'title': 'Тест с аватаркой',
            'image': f'http://testserver/media/{self.test_with_image.image}',
            'created': self.test_with_image.created.astimezone(timezone('Europe/Moscow')).isoformat(),
            'is_published': True
        }
        expected_data = [
            expected_test_with_image,
            expected_test_with_user
        ]
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response_data, expected_data)

    def test_created_search(self):
        url = f'/api/tests/created/?search=аватар'
        self.client.force_login(self.user)
        response = self.get_response_and_check_queries(url, expected_queries=3)
        response_data = response.data['results']
        expected_test_with_image = {
            'id': self.test_with_image.id,
            'title': 'Тест с аватаркой',
            'image': f'http://testserver/media/{self.test_with_image.image}',
            'created': self.test_with_image.created.astimezone(timezone('Europe/Moscow')).isoformat(),
            'is_published': True
        }
        expected_data = [
            expected_test_with_image,
        ]
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response_data, expected_data)

    def test_created_filter(self):
        url = f'/api/tests/created/?is_published=False'
        self.client.force_login(self.user)
        response = self.get_response_and_check_queries(url, expected_queries=3)
        response_data = response.data['results']
        expected_data = []
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response_data, expected_data)

    def test_questions(self):
        url = f'/api/tests/{self.test_with_image.id}/questions/'
        self.client.force_login(self.user)
        response = self.get_response_and_check_queries(url, expected_queries=4)
        expected_test_with_image = {
            'id': self.test_with_image.id,
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
                    'image': f'/media/{self.question_1.image}'
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
            'title': 'Тест с аватаркой',
            'is_published': True,
            'has_points': True,
            'has_questions_explanation': True
        }
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data, expected_test_with_image)

    def test_questions_without_explanation_and_points(self):
        self.client.force_login(self.user)
        patch_url = f'/api/tests/{self.test_with_image.id}/'
        data = {
            'has_questions_explanation': False,
            'has_points': False,
            'has_right_answers': False
        }
        json_data = json.dumps(data)
        self.client.patch(patch_url, data=json_data, content_type='application/json')

        url = f'/api/tests/{self.test_with_image.id}/questions/'
        response = self.get_response_and_check_queries(url, expected_queries=4)
        expected_test_with_image = {
            'id': self.test_with_image.id,
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
                    'image': f'/media/{self.question_1.image}'
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
                    'image': None
                }
            ],
            'title': 'Тест с аватаркой',
            'is_published': True,
            'has_points': False,
            'has_questions_explanation': False
        }
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data, expected_test_with_image)

    def tearDown(self):
        self.test_with_image.image.delete()
        self.question_1.image.delete()
