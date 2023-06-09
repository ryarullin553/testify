# Generated by Django 4.1.7 on 2023-06-01 20:48

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('is_true', models.BooleanField(default=None)),
            ],
            options={
                'db_table': 'answers',
            },
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
            ],
            options={
                'db_table': 'questions',
            },
        ),
        migrations.CreateModel(
            name='Test',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=64, verbose_name='Название')),
                ('description', models.CharField(max_length=512, verbose_name='Краткое описание')),
                ('full_description', models.TextField(verbose_name='Полное описание')),
                ('avatar', models.ImageField(blank=True, upload_to='images/test_avatars/%Y/%m/%d/', verbose_name='Аватар')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Создано')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='Обновлено')),
                ('is_published', models.BooleanField(default=False, verbose_name='Опубликовано')),
            ],
            options={
                'db_table': 'tests',
            },
        ),
    ]
