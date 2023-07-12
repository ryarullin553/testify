from django.db import models


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
        to='comments.Comment',
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

