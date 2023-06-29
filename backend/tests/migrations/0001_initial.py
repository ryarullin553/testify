# Generated by Django 4.1.7 on 2023-06-27 14:10

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Test',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=64, verbose_name='Название')),
                ('short_description', models.CharField(max_length=512, verbose_name='Краткое описание')),
                ('description', models.TextField(blank=True, verbose_name='Описание')),
                ('image', models.ImageField(blank=True, upload_to='images/tests/%Y/%m/%d/', verbose_name='Логотип')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Создано')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='Изменено')),
                ('is_published', models.BooleanField(default=False, verbose_name='Опубликовано')),
                ('has_points', models.BooleanField(default=True, verbose_name='Добавить баллы к вопросам')),
                ('has_comments', models.BooleanField(default=True, verbose_name='Открыть комментарии к вопросам')),
                ('has_right_answers', models.BooleanField(default=True, verbose_name='Показывать правильные ответы после прохождения теста')),
                ('has_questions_explanation', models.BooleanField(default=False, verbose_name='Добавить пояснения к вопросам, которые появятся после прохождения теста')),
            ],
            options={
                'verbose_name': 'Тест',
                'verbose_name_plural': 'Тесты',
                'db_table': 'tests',
                'ordering': ['-created'],
            },
        ),
    ]