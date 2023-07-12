import time
from pathlib import Path

from django.db import connection
from django.test.utils import CaptureQueriesContext
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.exceptions import ErrorDetail
from rest_framework.test import APITestCase

from bookmarks.models import Bookmark
from users.models import User
from tests.models import Test


class BookmarkAPITestCase(APITestCase):
    def setUp(self):
        path = Path('media', 'tests', 'logo.png')
        with open(path, "rb") as f:
            self.image = SimpleUploadedFile('logo.png', f.read(), content_type='image/png')

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
        self.test_with_image = Test.objects.create(
            title='Тест с аватаркой',
            short_description='Опубликованный тест с описанием и аватаркой от пользователя',
            description='Описание теста',
            user=self.user,
            image=self.image,
            is_published=True,
            has_questions_explanation=True
        )
        self.test_with_user = Test.objects.create(
            title='Тест от пользователя',
            short_description='Опубликованный тест с описанием от пользователя',
            description='Описание теста',
            user=self.user,
            is_published=True
        )
        self.bookmark_1 = Bookmark.objects.create(
            user=self.user_2,
            test=self.test_with_image
        )
        time.sleep(0.1)
        self.bookmark_2 = Bookmark.objects.create(
            user=self.user_2,
            test=self.test_with_user
        )

    def test_list(self):
        url = '/api/bookmarks/'
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.get(url)
            self.assertEqual(3, len(queries))
        response_data = response.data['results']
        expected_bookmark_1 = {
            'test': self.test_with_image.id,
            'title': 'Тест с аватаркой',
            'image': f'http://testserver/media/{self.test_with_image.image}'
        }
        expected_bookmark_2 = {
            'test': self.test_with_user.id,
            'title': 'Тест от пользователя',
            'image': None
        }
        expected_data = [
            expected_bookmark_2,
            expected_bookmark_1
        ]
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(expected_data, response_data)

    def test_create(self):
        self.simple_published_test = Test.objects.create(
            title='Простой тест',
            short_description='Опубликованный тест только с необходимыми полями для создания',
            is_published=True
        )
        self.assertEqual(2, Bookmark.objects.count())
        url = '/api/bookmarks/'
        data = {
            'test': self.simple_published_test.id
        }
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post(url, data=data)
            self.assertEqual(5, len(queries))
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(3, Bookmark.objects.count())

    def test_create_not_unique_test_and_user(self):
        self.assertEqual(2, Bookmark.objects.count())
        url = '/api/bookmarks/'
        data = {
            'test': self.test_with_image.id
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
        self.assertEqual(2, Bookmark.objects.count())

    def test_delete(self):
        self.assertEqual(2, Bookmark.objects.count())
        url = f'/api/bookmarks/{self.test_with_image.id}/'
        self.client.force_login(self.user_2)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.delete(url)
            self.assertEqual(4, len(queries))
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertEqual(1, Bookmark.objects.count())

    def test_delete_not_user(self):
        self.assertEqual(2, Bookmark.objects.count())
        url = f'/api/bookmarks/{self.test_with_image.id}/'
        self.client.force_login(self.user)
        with CaptureQueriesContext(connection) as queries:
            response = self.client.delete(url)
            self.assertEqual(3, len(queries))
        self.assertEqual(status.HTTP_404_NOT_FOUND, response.status_code)
        self.assertEqual(2, Bookmark.objects.count())

    def tearDown(self):
        self.test_with_image.image.delete()
