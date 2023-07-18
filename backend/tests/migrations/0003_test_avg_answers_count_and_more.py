# Generated by Django 4.1.7 on 2023-07-17 13:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tests', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='test',
            name='avg_answers_count',
            field=models.DecimalField(decimal_places=1, default=0, max_digits=4, verbose_name='Среднее количество ответов'),
        ),
        migrations.AddField(
            model_name='test',
            name='avg_correct_answers_count',
            field=models.DecimalField(decimal_places=1, default=0, max_digits=4, verbose_name='Среднее количество правильных ответов'),
        ),
        migrations.AddField(
            model_name='test',
            name='avg_score',
            field=models.DecimalField(decimal_places=1, default=0, max_digits=3, verbose_name='Средний результат'),
        ),
    ]
