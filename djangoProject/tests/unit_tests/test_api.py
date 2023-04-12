from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from tests.serializers import *
from tests.models import *


class TestAPITestCase(APITestCase):
    def test_get(self):
        test_1 = Test.objects.create(title='Тест №1', description='Описание теста', full_description='Полное описание теста')
        test_2 = Test.objects.create(title='Тест №2', description='Описание теста', full_description='Полное описание теста')
        url = reverse('tests')
        response = self.client.get(url)
        test_serializer = TestSerializer([test_1, test_2], many=True)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(test_serializer.data, response.data)
