from django.db import models

from tests.tasks import update_test_rating


class Feedback(models.Model):
    RATE_CHOICES = [(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)]

    rate = models.PositiveSmallIntegerField(
        verbose_name='Оценка',
        choices=RATE_CHOICES
    )
    content = models.TextField(
        verbose_name='Содержание',
        blank=True
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

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        update_test_rating.delay(self.test_id)

    def delete(self, *args, **kwargs):
        update_test_rating.delay(self.test_id)
        super().delete(*args, **kwargs)

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
