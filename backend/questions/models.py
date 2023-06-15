from django.db import models


class Question(models.Model):
    content = models.TextField()
    test = models.ForeignKey(to='tests.Test', on_delete=models.CASCADE)

    class Meta:
        db_table = 'questions'

    def __str__(self):
        return f"Тест {self.test} вопрос №{self.pk}"


class Answer(models.Model):
    content = models.TextField()
    question = models.ForeignKey(to=Question, on_delete=models.CASCADE)
    is_true = models.BooleanField(default=None)

    class Meta:
        db_table = 'answers'

    def __str__(self):
        return f"{self.question} ответ №{self.pk}"