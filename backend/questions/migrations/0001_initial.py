# Generated by Django 4.1.7 on 2023-06-27 14:10

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('Single choice', 'Одиночный выбор'), ('Multiple choice', 'Множественный выбор'), ('Text input', 'Ввод текста'), ('Matching', 'Установление соответствий'), ('Sequencing', 'Установление последовательности'), ('Tabular task', 'Табличная задача')], default='Single choice', max_length=30, verbose_name='Тип')),
                ('content', models.TextField(verbose_name='Содержание')),
                ('answer_choices', django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), size=20, verbose_name='Варианты ответов')),
                ('points', models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Баллы')),
                ('explanation', models.TextField(blank=True, verbose_name='Пояснение')),
                ('image', models.ImageField(blank=True, upload_to='images/questions/%Y/%m/%d/', verbose_name='Изображение')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='Дата изменения')),
            ],
            options={
                'verbose_name': 'Вопрос',
                'verbose_name_plural': 'Вопросы',
                'db_table': 'questions',
            },
        ),
    ]
