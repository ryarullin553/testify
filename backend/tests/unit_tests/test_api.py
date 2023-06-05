import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from ..serializers import *
from ..models import *
from django.contrib.auth import get_user_model


class TestAPITestCase(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create(username='test_username')
        self.test_1 = Test.objects.create(title='Тест №1', description='Описание теста',
                                          full_description='Полное описание теста')
        self.test_2 = Test.objects.create(title='Тест №2', description='Описание теста',
                                          full_description='Полное описание теста')

    def test_get(self):
        url = reverse('tests')
        self.client.force_login(self.user)
        response = self.client.get(url)
        test_serializer = TestSerializer([self.test_1, self.test_2], many=True)
        self.assertEqual(status.HTTP_200_OK, response.status_code)

    def test_create(self):
        url = reverse('tests')
        data = {
            "title": "Первый тест",
            "description": "Описание теста",
            "full_description": "Полное описание теста"
        }
        json_data = json.dumps(data)
        self.client.force_login(self.user)
        response = self.client.post(url, data=json_data, content_type='application/json')

        self.assertEqual(status.HTTP_201_CREATED, response.status_code)

    """def test_update_ok(self):
        self.client.force_login(self.user)
        self.test_1 = Test.objects.create(title='Тест №1', description='Описание теста',
                                          full_description='Полное описание теста')
        url = reverse('update_test', args=(self.test_1.pk,))
        data = {
            "title": self.test_1.title,
            "description": "Тест предназначенный для unit",
            "full_description": self.test_1.full_description
        }
        json_data = json.dumps(data)
        response = self.client.put(url, data=json_data, content_type='application/json')

        self.assertEqual(status.HTTP_200_OK, response.status_code)"""

    def test_update(self):  # негативный
        url = reverse('update_test', args=(self.test_1.pk,))
        self.client.force_login(self.user)
        data = {
            "title": self.test_1.title,
            "description": "Тест предназначенный для unit",
            "full_description": self.test_1.full_description
        }
        json_data = json.dumps(data)
        response = self.client.put(url, data=json_data, content_type='application/json')

        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)
        # self.test_1.refresh_from_db()
        # self.assertEqual("Тест предназначенный для unit", self.test_1.description)

    def test_delete(self):  # негативный
        url = reverse('update_test', args=(self.test_1.pk,))
        self.client.force_login(self.user)
        data = {
            "title": self.test_1.title,
            "description": self.test_1.description,
            "full_description": self.test_1.full_description
        }
        json_data = json.dumps(data)
        response = self.client.delete(url, data=json_data, content_type='application/json')

        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)


class CatalogViewSetTestCase(APITestCase):  # надо дописать
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create(username='test_username')

    def test_get_catalog(self):
        url = reverse('catalog')
        self.client.force_login(self.user)
        response = self.client.get(url)
        print(response)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
