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
        verbose_name='Описание',
        blank=True
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
        verbose_name='Добавить баллы к вопросам',
        default=True
    )
    has_comments = models.BooleanField(
        verbose_name='Открыть комментарии к вопросам',
        default=True
    )
    has_right_answers = models.BooleanField(
        verbose_name='Показывать правильные ответы после прохождения теста',
        default=True
    )
    has_questions_explanation = models.BooleanField(
        verbose_name='Добавить пояснения к вопросам, которые появятся после прохождения теста',
        default=False
    )
    user = models.ForeignKey(
        verbose_name='Автор',
        to='users.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='tests'
    )
    rating = models.DecimalField(
        verbose_name='Рейтинг',
        max_digits=2,
        decimal_places=1,
        default=0
    )
    feedbacks_count = models.IntegerField(
        verbose_name='Количество отзывов',
        default=0
    )
    results_count = models.IntegerField(
        verbose_name='Количество результатов',
        default=0
    )

    class Meta:
        verbose_name = 'Тест'
        verbose_name_plural = 'Тесты'
        db_table = 'tests'
        ordering = ['-created']

    def __str__(self):
        return self.title
