from datetime import datetime
import time

from django.db import connection
from django.test.utils import CaptureQueriesContext
from rest_framework import status
from rest_framework.exceptions import ErrorDetail
from rest_framework.test import APITestCase

from answers.models import Answer
from likes.models import Like
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
                'answers_count': 2,
                'correct_answers_count': 1,
                'passage_time': '00:00:00',
                'finished_time': datetime.now().isoformat(timespec='minutes'),
                'score': 50
            }
        )
        self.finished_passage_2 = Passage.objects.create(
            test=self.test,
            user=self.user,
            result={
                'questions_count': 2,
                'answers_count': 2,
                'correct_answers_count': 2,
                'passage_time': '00:00:00',
                'finished_time': datetime.now().isoformat(timespec='minutes'),
                'score': 100
            },
            codeword='11Б'
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
        self.answer_1 = Answer.objects.create(
            passage_id=self.passage.id,
            question_id=self.question_1.id,
            content=[
                'Первый ответ'
            ]
        )
        self.answer_2 = Answer.objects.create(
            passage_id=self.passage.id,
            question_id=self.question_2.id,
            content=[
                'Второй ответ'
            ]
        )
        self.answer_3 = Answer.objects.create(
            passage_id=self.passage_test_without_points.id,
            question_id=self.question_3.id,
            content=[
                'Третий ответ'
            ]
        )
        self.like_1 = Like.objects.create(
            user_id=self.user.id,
            question_id=self.question_1.id,
            is_like=True
        )
        self.like_2 = Like.objects.create(
            user_id=self.user_2.id,
            question_id=self.question_1.id,
            is_like=False
        )

    def test_retrieve(self):
        url = f'/api/passages/{self.passage.id}/'
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(5, len(queries))
        expected_passage = {
            'id': self.passage.id,
            'user_id': str(self.user_2.id),
            'test': self.test.id,
            'test_data': {
                'questions': [
                    {
                        'id': self.question_1.id,
                        'likes_count': 0,
                        'dislikes_count': 0,
                        'has_like': True,
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
                        'likes_count': 0,
                        'dislikes_count': 0,
                        'has_like': False,
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
            'answers': [
                {
                    'id': self.answer_1.id,
                    'question': self.question_1.id,
                    'content': [
                        'Первый ответ'
                    ]
                },
                {
                    'id': self.answer_2.id,
                    'question': self.question_2.id,
                    'content': [
                        'Второй ответ'
                    ]
                }
            ],
            'result': None,
            'codeword': ''
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
            'user_id': str(self.user_2.id),
            'test': self.test_without_points.id,
            'test_data': {
                'questions': [
                    {
                        'id': self.question_3.id,
                        'likes_count': 0,
                        'dislikes_count': 0,
                        'has_like': False,
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
            'answers': [
                {
                    'id': self.answer_3.id,
                    'question': self.question_3.id,
                    'content': [
                        'Третий ответ'
                    ]
                }
            ],
            'result': None,
            'codeword': ''
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
            'user_id': str(self.user_2.id),
            'test': self.test.id,
            'test_data': {
                'questions': [
                    {
                        'id': self.question_1.id,
                        'likes_count': 0,
                        'dislikes_count': 0,
                        'has_like': True,
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
                        'likes_count': 0,
                        'dislikes_count': 0,
                        'has_like': False,
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
                'questions_count': 2,
                'answers_count': 2,
                'correct_answers_count': 1,
                'passage_time': '00:00:00',
                'finished_time': self.finished_passage.result['finished_time'],
                'score': 50
            },
            'codeword': ''
        }
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data, expected_passage)

    def test_create(self):
        self.assertEqual(4, Passage.objects.count())
        url = '/api/passages/'
        data = {
            'test': self.test.id
        }
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(6, len(queries))
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(5, Passage.objects.count())

    def test_create_not_published(self):
        self.assertEqual(4, Passage.objects.count())
        url = '/api/passages/'
        data = {
            'test': self.test_not_published.id
        }
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(3, len(queries))
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(4, Passage.objects.count())

    def test_partial_update(self):
        url = f'/api/passages/{self.passage.id}/'
        expected_result = {
            'questions_count': 2,
            'answers_count': 2,
            'correct_answers_count': 1,
            'passage_time': '00:00:00',
            'finished_time': datetime.now().isoformat(timespec='minutes'),
            'total_points': 7,
            'user_points': 2,
            'score': 29
        }
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.patch(url)
            self.assertEqual(4, len(queries))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.passage.refresh_from_db()
        self.assertEqual(expected_result, self.passage.result)

    def test_partial_update_without_points(self):
        url = f'/api/passages/{self.passage_test_without_points.id}/'
        expected_result = {
            'questions_count': 1,
            'answers_count': 1,
            'correct_answers_count': 1,
            'passage_time': '00:00:00',
            'finished_time': datetime.now().isoformat(timespec='minutes'),
            'score': 100
        }
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.patch(url)
            self.assertEqual(4, len(queries))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.passage_test_without_points.refresh_from_db()
        self.assertEqual(expected_result, self.passage_test_without_points.result)

    def test_partial_update_has_result(self):
        url = f'/api/passages/{self.finished_passage.id}/'
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.patch(url)
            self.assertEqual(3, len(queries))
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)

    def test_partial_update_not_user(self):
        url = f'/api/passages/{self.passage.id}/'
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.patch(url)
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

    def test_current_user(self):
        url = f'/api/tests/{self.test.id}/passages/my/'
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
                'answers_count': 2,
                'correct_answers_count': 1,
                'passage_time': '00:00:00',
                'finished_time': self.finished_passage.result['finished_time'],
                'score': 50
            }
        }
        expected_data = [
            expected_finished_passage,
            expected_passage
        ]
        response_data = response.data['results']
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(expected_data, response_data)

    def test_passages(self):
        url = f'/api/tests/{self.test.id}/passages/'
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(3, len(queries))
        expected_finished_passage_2 = {
            'id': self.finished_passage_2.id,
            'user_id': str(self.user.id),
            'user_name': self.user.username,
            'result': {
                'questions_count': 2,
                'answers_count': 2,
                'correct_answers_count': 2,
                'passage_time': '00:00:00',
                'finished_time': self.finished_passage_2.result['finished_time'],
                'score': 100
            },
            'codeword': '11Б'
        }
        expected_finished_passage = {
            'id': self.finished_passage.id,
            'user_id': str(self.user_2.id),
            'user_name': self.user_2.username,
            'result': {
                'questions_count': 2,
                'answers_count': 2,
                'correct_answers_count': 1,
                'passage_time': '00:00:00',
                'finished_time': self.finished_passage.result['finished_time'],
                'score': 50
            },
            'codeword': ''
        }
        expected_data = [
            expected_finished_passage_2,
            expected_finished_passage
        ]
        response_data = response.data['results']
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(expected_data, response_data)

    def test_search_passages(self):
        url = f'/api/tests/{self.test.id}/passages/?search={self.user_2.username}'
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(3, len(queries))
        expected_finished_passage = {
            'id': self.finished_passage.id,
            'user_id': str(self.user_2.id),
            'user_name': self.user_2.username,
            'result': {
                'questions_count': 2,
                'answers_count': 2,
                'correct_answers_count': 1,
                'passage_time': '00:00:00',
                'finished_time': self.finished_passage.result['finished_time'],
                'score': 50
            },
            'codeword': ''
        }
        expected_data = [
            expected_finished_passage
        ]
        response_data = response.data['results']
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(expected_data, response_data)

    def test_ordering_passages(self):
        url = f'/api/tests/{self.test.id}/passages/?ordering=result__score'
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(3, len(queries))
        expected_finished_passage_2 = {
            'id': self.finished_passage_2.id,
            'user_id': str(self.user.id),
            'user_name': self.user.username,
            'result': {
                'questions_count': 2,
                'answers_count': 2,
                'correct_answers_count': 2,
                'passage_time': '00:00:00',
                'finished_time': self.finished_passage_2.result['finished_time'],
                'score': 100
            },
            'codeword': '11Б'
        }
        expected_finished_passage = {
            'id': self.finished_passage.id,
            'user_id': str(self.user_2.id),
            'user_name': self.user_2.username,
            'result': {
                'questions_count': 2,
                'answers_count': 2,
                'correct_answers_count': 1,
                'passage_time': '00:00:00',
                'finished_time': self.finished_passage.result['finished_time'],
                'score': 50
            },
            'codeword': ''
        }
        expected_data = [
            expected_finished_passage,
            expected_finished_passage_2
        ]
        response_data = response.data['results']
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(expected_data, response_data)