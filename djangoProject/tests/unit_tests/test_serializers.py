from django.test import TestCase
from tests.models import Test
from tests.serializers import TestSerializer


class TestSerializerTestCase(TestCase):
    def test_ok(self):
        test_1 = Test.objects.create(title='Тест №1', description='Описание теста', full_description='Полное описание теста')
        test_2 = Test.objects.create(title='Тест №2', description='Описание теста', full_description='Полное описание теста')
        data = TestSerializer([test_1, test_2], many=True).data
        expected_data = [
            {
                'id': test_1.pk,
                'title': 'Тест №1',
                'description': 'Описание теста',
                'full_description': 'Полное описание теста',
                'avatar': None,
                'author': None,
                'is_published': False
            },
            {
                'id': test_2.pk,
                'title': 'Тест №2',
                'description': 'Описание теста',
                'full_description': 'Полное описание теста',
                'avatar': None,
                'author': None,
                'is_published': False
            }
        ]
        self.assertEqual(expected_data, data)
