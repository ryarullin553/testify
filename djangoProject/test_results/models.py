from django.db import models


class Result(models.Model):
    """Результат теста пользователя"""
    user = models.ForeignKey('users.MyUser', on_delete=models.CASCADE)
    test = models.ForeignKey('tests.Test', on_delete=models.CASCADE)
    is_finished = models.BooleanField(default=False)
    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'result'

    def __str__(self):
        return f"Результат теста {self.test} пользователя {self.user.username}"


class ChoicedAnswer(models.Model):
    """Ответы пользователя при прохождении теста"""
    result = models.ForeignKey(Result, on_delete=models.CASCADE)
    answer = models.ForeignKey('tests.Answer', on_delete=models.CASCADE)

    class Meta:
        db_table = 'choiced_answer'

    def __str__(self):
        return f"Ответ №{self.pk} результата №{self.result.pk}"
