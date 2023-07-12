from django.db import models


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
        to='comments.Comment',
        on_delete=models.CASCADE,
        null=True,
        related_name='comments'
    )

    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'
        db_table = 'comments'


