# Generated by Django 4.1.7 on 2023-06-30 08:15

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Passage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('result', models.JSONField(null=True, verbose_name='Результат')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Создано')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='Изменено')),
            ],
            options={
                'verbose_name': 'Прохождение',
                'verbose_name_plural': 'Прохождения',
                'db_table': 'passages',
                'ordering': ['-created'],
            },
        ),
    ]
