from django.db import models


class Test(models.Model):
    title = models.CharField(
        verbose_name='Название',
        max_length=64
    )
    short_description = models.CharField(
        verbose_name='Краткое описание',
        max_length=512
    )
    description = models.TextField(
        verbose_name='Описание'
    )
    image = models.ImageField(
        verbose_name='Логотип',
        upload_to='images/tests/%Y/%m/%d/',
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
    is_published = models.BooleanField(
        verbose_name='Опубликовано',
        default=False
    )
    has_points = models.BooleanField(
        verbose_name='Добавить баллы к вопросам'
    )
    has_comments = models.BooleanField(
        verbose_name='Открыть комментарии к вопросам'
    )
    has_right_answers = models.BooleanField(
        verbose_name='Показывать правильные ответы после прохождения теста'
    )
    has_questions_explanation = models.BooleanField(
        verbose_name='Показывать пояснения к вопросам после прохождения теста'
    )
    user = models.ForeignKey(
        verbose_name='Автор',
        to='users.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='tests'
    )

    class Meta:
        verbose_name = 'Тест'
        verbose_name_plural = 'Тесты'
        db_table = 'tests'
        ordering = ['-created']

    def __str__(self):
        return self.title
