from django.contrib.postgres.fields import ArrayField
from django.db import models


class Answer(models.Model):
    content = ArrayField(
        verbose_name='Содержание',
        base_field=models.TextField(),
        max_length=20
    )
    created = models.DateTimeField(
        verbose_name='Создано',
        auto_now_add=True
    )
    updated = models.DateTimeField(
        verbose_name='Изменено',
        auto_now=True
    )
    question = models.ForeignKey(
        verbose_name='Вопрос',
        to='questions.Question',
        on_delete=models.CASCADE,
        related_name='answers'
    )
    passage = models.ForeignKey(
        verbose_name='Прохождение',
        to='passages.Passage',
        on_delete=models.CASCADE,
        related_name='answers'
    )

    class Meta:
        verbose_name = 'Ответ'
        verbose_name_plural = 'Ответы'
        db_table = 'answers'
        ordering = ['-created']
        unique_together = ['passage', 'question']
        # Заменить, когда DRF обновится до 3.15 и сможет поддерживать UniqueConstraint
        #
        # constraints = [
        #     models.UniqueConstraint(
        #         fields=('passage', 'question'),
        #         name='unique_for_passage'
        #     )
        # ]

    def __str__(self):
        return f"{self.passage} id ответа {self.id}"
    