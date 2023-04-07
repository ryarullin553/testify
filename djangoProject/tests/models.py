from django.db import models


class Test(models.Model):
    title = models.CharField(max_length=64, verbose_name='Название')
    description = models.CharField(max_length=512, verbose_name='Краткое описание')
    full_description = models.TextField(verbose_name='Полное описание')
    avatar = models.ImageField(upload_to='images/test_avatars/%Y/%m/%d/', verbose_name='Аватар', blank=True)
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Создано')
    time_update = models.DateTimeField(auto_now=True, verbose_name='Обновлено')
    is_published = models.BooleanField(default=True, verbose_name='Опубликовано')
    author = models.ForeignKey('users.MyUser', on_delete=models.SET_NULL, null=True, verbose_name='Автор',
                               related_name='tests_create')

    def __str__(self):
        return self.title


class TestQuestion(models.Model):
    content = models.TextField()
    test = models.ForeignKey(Test, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.test} question #{self.pk}"


class TestAnswer(models.Model):
    content = models.TextField()
    question = models.ForeignKey(TestQuestion, on_delete=models.CASCADE)
    is_true = models.BooleanField(default=None)

    def __str__(self):
        return f"{self.question} answer #{self.pk}"


class TestResult(models.Model):
    user = models.ForeignKey('users.MyUser', on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    correct_answers = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    score = models.FloatField(default=0)

    def __str__(self):
        return f'{self.user.username} - {self.test.title}'


class TestResultAnswer(models.Model):
    result = models.ForeignKey(TestResult, on_delete=models.CASCADE, related_name='result_answers')
    question = models.ForeignKey(TestQuestion, on_delete=models.CASCADE)
    answer = models.ForeignKey(TestAnswer, on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)
