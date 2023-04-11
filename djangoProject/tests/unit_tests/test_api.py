from django.test import TestCase
from rest_framework.test import APITestCase


class TestAPITestCase(APITestCase):
    def test_get(self):
        url = 'http://127.0.0.1:8000/api/tests/'
        response = self.client.get(url)
        print(response.data)
