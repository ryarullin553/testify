from django.db import models


class Bookmark(models.Model):
    created = models.DateTimeField(
        verbose_name='Создано',
        auto_now_add=True
    )
    user = models.ForeignKey(
        verbose_name='Пользователь',
        to='users.User',
        on_delete=models.CASCADE,
        related_name='bookmarks'
    )
    test = models.ForeignKey(
        verbose_name='Тест',
        to='tests.Test',
        on_delete=models.CASCADE,
        related_name='bookmarks'
    )

    class Meta:
        verbose_name = 'Закладка'
        verbose_name_plural = 'Закладки'
        db_table = 'bookmarks'
        unique_together = ('user', 'test')
        # Заменить, когда DRF обновится до 3.15 и сможет поддерживать UniqueConstraint
        #
        # constraints = [
        #     models.UniqueConstraint(
        #         fields=('user', 'test'),
        #         name='unique_user_and_test'
        #     )
        # ]


class Feedback(models.Model):
    RATE_CHOICES = [(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)]

    rate = models.PositiveSmallIntegerField(
        verbose_name='Оценка',
        choices=RATE_CHOICES
    )
    content = models.TextField(
        verbose_name='Содержание'
    )
    created = models.DateTimeField(
        verbose_name='Создано',
        auto_now_add=True
    )
    updated = models.DateTimeField(
        verbose_name='Изменено',
        auto_now=True
    )
    user = models.ForeignKey(
        verbose_name='Пользователь',
        to='users.User',
        on_delete=models.CASCADE,
        related_name='feedbacks'
    )
    test = models.ForeignKey(
        verbose_name='Тест',
        to='tests.Test',
        on_delete=models.CASCADE,
        related_name='feedbacks'
    )

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        db_table = 'feedbacks'
        unique_together = ('user', 'test')
        # Заменить, когда DRF обновится до 3.15 и сможет поддерживать UniqueConstraint
        #
        # constraints = [
        #     models.UniqueConstraint(
        #         fields=('user', 'test'),
        #         name='unique_user_and_test
        #     )
        # ]


class Comment(models.Model):
    content = models.TextField(
        verbose_name='Содержание'
    )
    created = models.DateTimeField(
        verbose_name='Создано',
        auto_now_add=True
    )
    updated = models.DateTimeField(
        verbose_name='Изменено',
        auto_now=True
    )
    user = models.ForeignKey(
        verbose_name='Пользователь',
        to='users.User',
        on_delete=models.CASCADE,
        related_name='comments'
    )
    question = models.ForeignKey(
        verbose_name='Вопрос',
        to='questions.Question',
        on_delete=models.CASCADE,
        null=True,
        related_name='comments'
    )
    comment = models.ForeignKey(
        verbose_name='Комментарий',
        to='Comment',
        on_delete=models.CASCADE,
        null=True,
        related_name='comments'
    )

    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'
        db_table = 'comments'


class Like(models.Model):
    is_like = models.BooleanField(
        verbose_name='Значение',
        default=None
    )
    created = models.DateTimeField(
        verbose_name='Создано',
        auto_now_add=True
    )
    updated = models.DateTimeField(
        verbose_name='Изменено',
        auto_now=True
    )
    user = models.ForeignKey(
        verbose_name='Пользователь',
        to='users.User',
        on_delete=models.CASCADE,
        related_name='likes'
    )
    question = models.ForeignKey(
        verbose_name='Вопрос',
        to='questions.Question',
        on_delete=models.CASCADE,
        null=True,
        related_name='likes'
    )
    comment = models.ForeignKey(
        verbose_name='Комментарий',
        to='Comment',
        on_delete=models.CASCADE,
        null=True,
        related_name='likes'
    )

    class Meta:
        verbose_name = 'Лайк'
        verbose_name_plural = 'Лайки'
        db_table = 'likes'
        unique_together = (['user', 'question'], ['user', 'comment'])
        # Заменить, когда DRF обновится до 3.15 и сможет поддерживать UniqueConstraint
        #
        # constraints = [
        #     models.UniqueConstraint(
        #         fields=('user', 'question'),
        #         name='unique_user_and_question'
        #     ),
        #     models.UniqueConstraint(
        #         fields=('user', 'comment'),
        #         name='unique_user_and_comment'
        #     )
        # ]
