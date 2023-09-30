from django.db import models

from .managers import PassageManager


class Passage(models.Model):
    result = models.JSONField(
        verbose_name='Результат',
        null=True
    )
    codeword = models.CharField(
        verbose_name='Кодовое слово',
        max_length=40,
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
        related_name='passages'
    )
    test = models.ForeignKey(
        verbose_name='Тест',
        to='tests.Test',
        on_delete=models.CASCADE,
        related_name='passages'
    )

    objects = PassageManager()

    class Meta:
        verbose_name = 'Прохождение'
        verbose_name_plural = 'Прохождения'
        db_table = 'passages'
        ordering = ['-created']

    def __str__(self):
        return f"Прохождение теста '{self.test}' " \
               f"пользователя {self.user.username}"
