from django.db import models
from django.contrib.postgres.fields import ArrayField

from questions.managers import QuestionManager


class Question(models.Model):
    QUESTION_TYPES = [
        ('Single choice', 'Одиночный выбор'),
        ('Multiple choice', 'Множественный выбор'),
        ('Text input', 'Ввод текста'),
        ('Matching', 'Установление соответствий'),
        ('Sequencing', 'Установление последовательности'),
        ('Tabular task', 'Табличная задача')
    ]
    type = models.CharField(
        verbose_name='Тип',
        max_length=30,
        choices=QUESTION_TYPES,
        default='Single choice'
    )
    content = models.TextField(
        verbose_name='Содержание'
    )
    answer_choices = ArrayField(
        verbose_name='Варианты ответов',
        base_field=models.TextField(),
        size=20
    )
    right_answers = ArrayField(
        verbose_name='Правильные ответы',
        base_field=models.TextField(),
        size=20
    )
    points = models.PositiveSmallIntegerField(
        verbose_name='Баллы',
        null=True,
        blank=True
    )
    explanation = models.TextField(
        verbose_name='Пояснение',
        blank=True
    )
    image = models.ImageField(
        verbose_name='Изображение',
        upload_to='images/questions/%Y/%m/%d/',
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
    likes_count = models.IntegerField(
        verbose_name='Количество лайков',
        default=0
    )
    dislikes_count = models.IntegerField(
        verbose_name='Количество дизлайков',
        default=0
    )
    test = models.ForeignKey(
        verbose_name='Тест',
        to='tests.Test',
        on_delete=models.CASCADE,
        related_name='questions'
    )

    objects = QuestionManager()

    class Meta:
        verbose_name = 'Вопрос'
        verbose_name_plural = 'Вопросы'
        db_table = 'questions'

    def __str__(self):
        return f"Тест '{self.test}' id вопроса {self.id}"
