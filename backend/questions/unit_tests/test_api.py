import json
from pathlib import Path

from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import connection
from django.test.utils import CaptureQueriesContext
from rest_framework import status
from rest_framework.test import APITestCase

from questions.models import Question
from tests.models import Test
from users.models import User


class QuestionAPITestCase(APITestCase):
    def setUp(self):
        path = Path('media', 'tests', 'logo.png')
        with open(path, "rb") as f:
            self.image = SimpleUploadedFile('logo.png', f.read(), content_type='image/png')

        self.user = User.objects.create_user(
            username='user',
            email='user@mail.ru',
            password='123'
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
                {
                    "content": "Первый ответ",
                    "is_true": True
                },
                {
                    "content": "Второй ответ",
                    "is_true": False
                },
                {
                    "content": "Третий ответ",
                    "is_true": False
                },
                {
                    "content": "Четвертый ответ",
                    "is_true": False
                }
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
                {
                    "content": "Первый ответ",
                    "is_true": False
                },
                {
                    "content": "Второй ответ",
                    "is_true": False
                },
                {
                    "content": "Третий ответ",
                    "is_true": True
                },
                {
                    "content": "Четвертый ответ",
                    "is_true": False
                }
            ],
            points=5
        )

    def test_create_single_choice(self):
        self.assertEqual(2, Question.objects.count())
        url = '/api/questions/'
        data = {
            'type': 'Single choice',
            'content': 'Содержание вопроса',
            'answer_choices': [
                {
                    'content': 'Первый ответ',
                    'is_true': True
                },
                {
                    'content': 'Второй ответ',
                    'is_true': False
                },
                {
                    'content': 'Третий ответ',
                    'is_true': False
                },
                {
                    'content': 'Четвертый ответ',
                    'is_true': False
                }
            ],
            'points': 2,
            'explanation': 'Пояснение к вопросу',
            'image': self.image.open(),
            'test': self.test_with_image.id
        }
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(5, len(queries))
        instance = Question.objects.get(id=response.data['id'])
        instance.image.delete()
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(3, Question.objects.count())

    def test_create_multiple_choice(self):
        self.assertEqual(2, Question.objects.count())
        url = '/api/questions/'
        data = {
            'type': 'Multiple choice',
            'content': 'Содержание вопроса',
            'answer_choices': [
                {
                    'content': 'Первый ответ',
                    'is_true': True
                },
                {
                    'content': 'Второй ответ',
                    'is_true': True
                },
                {
                    'content': 'Третий ответ',
                    'is_true': True
                },
                {
                    'content': 'Четвертый ответ',
                    'is_true': False
                }
            ],
            'points': 20,
            'explanation': 'Пояснение к вопросу',
            'image': self.image.open(),
            'test': self.test_with_image.id
        }
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(5, len(queries))
        instance = Question.objects.get(id=response.data['id'])
        instance.image.delete()
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(3, Question.objects.count())

    def test_create_text_input(self):
        self.assertEqual(2, Question.objects.count())
        url = '/api/questions/'
        data = {
            'type': 'Text input',
            'content': 'Содержание вопроса',
            'answer_choices': [
                'Правильный ответ'
            ],
            'points': 30,
            'explanation': 'Пояснение к вопросу',
            'test': self.test_with_image.id
        }
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(5, len(queries))
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(3, Question.objects.count())

    def test_create_matching(self):
        self.assertEqual(2, Question.objects.count())
        url = '/api/questions/'
        data = {
            'type': 'Matching',
            'content': 'Содержание вопроса',
            'answer_choices': [
                {
                    'Первый ответ': 'Первый ответ'
                },
                {
                    'Второй ответ': 'Второй ответ'
                },
                {
                    'Третий ответ': 'Третий ответ'
                },
                {
                    'Четвертый ответ': 'Четвертый ответ'
                }
            ],
            'points': 15,
            'explanation': 'Пояснение к вопросу',
            'test': self.test_with_image.id
        }
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(5, len(queries))
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(3, Question.objects.count())

    def test_create_sequencing(self):
        self.assertEqual(2, Question.objects.count())
        url = '/api/questions/'
        data = {
            'type': 'Sequencing',
            'content': 'Содержание вопроса',
            'answer_choices': [
                'Первый ответ',
                'Второй ответ',
                'Третий ответ',
                'Четвертый ответ'
            ],
            'points': 5,
            'explanation': 'Пояснение к вопросу',
            'test': self.test_with_image.id
        }
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(5, len(queries))
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(3, Question.objects.count())

    def test_update(self):
        url = f'/api/questions/{self.question_1.id}/'
        data = {
            'type': 'Sequencing',
            'content': 'Новое содержание вопроса',
            'answer_choices': [
                'Первый ответ',
                'Второй ответ',
                'Третий ответ',
                'Четвертый ответ'
            ],
            'points': 5,
            'explanation': 'Новое пояснение к вопросу',
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.patch(url, data=json_data, content_type='application/json')
            self.assertEqual(6, len(queries))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.question_1.refresh_from_db()
        self.assertEqual('Sequencing', self.question_1.type)
        self.assertEqual('Новое содержание вопроса', self.question_1.content)
        self.assertEqual(data['answer_choices'],  self.question_1.answer_choices)
        self.assertEqual(5, self.question_1.points)
        self.assertEqual('Новое пояснение к вопросу', self.question_1.explanation)

    def test_delete(self):
        self.assertEqual(2, Question.objects.count())
        url = f'/api/questions/{self.question_1.id}/'
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.delete(url)
            self.assertEqual(8, len(queries))
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertEqual(1, Question.objects.count())

    def tearDown(self):
        self.test_with_image.image.delete()
        self.question_1.image.delete()
