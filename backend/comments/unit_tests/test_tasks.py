from django.test import TestCase

from comments.models import Comment
from comments.tasks import update_comment_metrics
from likes.models import Like
from questions.models import Question
from tests.models import Test
from users.models import User


class TestCommentTasks(TestCase):
    def test_update_comment_metrics(self):
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
        comment = Comment.objects.create(
            user_id=user.id,
            question_id=question.id,
            content='Norm'
        )
        Like.objects.create(
            user_id=user.id,
            comment_id=comment.id,
            is_like=True
        )
        Like.objects.create(
            user_id=user2.id,
            comment_id=comment.id,
            is_like=False
        )
        update_comment_metrics(comment.id)
        updated_comment = Comment.objects.get(id=comment.id)
        self.assertEqual(updated_comment.likes_count, 1)
        self.assertEqual(updated_comment.dislikes_count, 1)
