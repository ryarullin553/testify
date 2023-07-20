from django.db import models

from comments.tasks import update_comment_metrics
from questions.tasks import update_question_metrics


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

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.__update_metrics()

    def delete(self, *args, **kwargs):
        self.__update_metrics()
        super().delete(*args, **kwargs)

    def __update_metrics(self):
        if self.question_id:
            update_question_metrics.delay(self.question_id)
        elif self.comment_id:
            update_comment_metrics.delay(self.comment_id)

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
