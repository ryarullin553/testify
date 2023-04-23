import json

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from ..serializers import *
from ..models import *


class TestAPITestCase(APITestCase):
    def setUp(self):
        self.test_1 = Test.objects.create(title='Тест №1', description='Описание теста',
                                     full_description='Полное описание теста')
        self.test_2 = Test.objects.create(title='Тест №2', description='Описание теста',
                                     full_description='Полное описание теста')

    def test_get(self):
        url = reverse('tests')
        response = self.client.get(url)
        test_serializer = TestSerializer([self.test_1, self.test_2], many=True)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(test_serializer.data, response.data)

    def test_create(self):
        url = reverse('tests')
        data ={
            "title": "Первый тест",
            "description": "Описание теста",
            "full_description": "Полное описание теста"
        }
        json_data = json.dumps(data)
        response = self.client.post(url, data=json_data, content_type='application/json')

        self.assertEqual(status.HTTP_201_CREATED, response.status_code)

    def test_update(self):
        url = reverse('update_test', args=(self.test_1.pk,))
        data ={
            "title": self.test_1.title,
            "description": "Тест предназначенный для unit",
            "full_description": self.test_1.full_description
        }
        json_data = json.dumps(data)
        response = self.client.put(url, data=json_data, content_type='application/json')

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.test_1.refresh_from_db()
        self.assertEqual("Тест предназначенный для unit", self.test_1.description)
    def test_delete(self):
        url = reverse('update_test', args=(self.test_1.pk,))
        data = {
            "title": self.test_1.title,
            "description": self.test_1.description,
            "full_description": self.test_1.full_description
        }
        json_data = json.dumps(data)
        response = self.client.delete(url, data=json_data, content_type='application/json')

        self.assertEqual(status.HTTP_200_OK, response.status_code)




