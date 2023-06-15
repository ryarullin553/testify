from django.db import models


class Test(models.Model):
    title = models.CharField(max_length=64, verbose_name='Название')
    description = models.CharField(max_length=512, verbose_name='Краткое описание')
    full_description = models.TextField(verbose_name='Полное описание')
    avatar = models.ImageField(upload_to='images/test_avatars/%Y/%m/%d/', verbose_name='Аватар', blank=True)
    created = models.DateTimeField(auto_now_add=True, verbose_name='Создано')
    updated = models.DateTimeField(auto_now=True, verbose_name='Обновлено')
    is_published = models.BooleanField(default=False, verbose_name='Опубликовано')
    user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='created_tests', verbose_name='Автор')

    class Meta:
        db_table = 'tests'

    def __str__(self):
        return self.title
