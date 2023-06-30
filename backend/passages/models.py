from django.db import models


class Passage(models.Model):
    result = models.JSONField(
        verbose_name='Результат',
        null=True
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
        related_name='passages'
    )
    test = models.ForeignKey(
        verbose_name='Тест',
        to='tests.Test',
        on_delete=models.CASCADE,
        limit_choices_to={
            'is_published': True
        },
        related_name='passages'
    )

    class Meta:
        verbose_name = 'Прохождение'
        verbose_name_plural = 'Прохождения'
        db_table = 'results'
        ordering = ['-created']

    def __str__(self):
        return f"Прохождение теста '{self.test}' пользователя {self.user.username}"
