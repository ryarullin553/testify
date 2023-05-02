from django.db import models


class Test(models.Model):
    title = models.CharField(max_length=64, verbose_name='Название')
    description = models.CharField(max_length=512, verbose_name='Краткое описание')
    full_description = models.TextField(verbose_name='Полное описание')
    avatar = models.ImageField(upload_to='images/test_avatars/%Y/%m/%d/', verbose_name='Аватар', blank=True)
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Создано')
    time_update = models.DateTimeField(auto_now=True, verbose_name='Обновлено')
    is_published = models.BooleanField(default=False, verbose_name='Опубликовано')
    user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, verbose_name='Автор')

    class Meta:
        db_table = 'tests'

    def __str__(self):
        return self.title


class Question(models.Model):
    content = models.TextField()
    test = models.ForeignKey(Test, on_delete=models.CASCADE)

    class Meta:
        db_table = 'questions'

    def __str__(self):
        return f"Тест {self.test} вопрос №{self.pk}"


class Answer(models.Model):
    content = models.TextField()
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    is_true = models.BooleanField(default=None)

    class Meta:
        db_table = 'answers'

    def __str__(self):
        return f"{self.question} ответ №{self.pk}"

