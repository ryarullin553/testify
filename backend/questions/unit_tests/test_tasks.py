from django.test import TestCase

from likes.models import Like
from questions.models import Question
from questions.tasks import update_question_metrics
from tests.models import Test
from users.models import User


class TestQuestionTasks(TestCase):
    def test_update_question_metrics(self):
        simple_published_test = Test.objects.create(
            title='Простой тест',
            short_description='Опубликованный тест только с необходимыми полями для создания',
            is_published=True
        )
        question = Question.objects.create(
            test_id=simple_published_test.id,
            type='Single choice',
            content='Содержание вопроса',
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
        user = User.objects.create_user(
            username='user',
            email='user@mail.ru',
            password='123'
        )
        user2 = User.objects.create_user(
            username='user2',
            email='user2@mail.ru',
            password='123'
        )
        Like.objects.create(
            user_id=user.id,
            question_id=question.id,
            is_like=True
        )
        Like.objects.create(
            user_id=user2.id,
            question_id=question.id,
            is_like=False
        )
        update_question_metrics(question.id)
        updated_question = Question.objects.get(id=question.id)
        self.assertEqual(updated_question.likes_count, 1)
        self.assertEqual(updated_question.dislikes_count, 1)
