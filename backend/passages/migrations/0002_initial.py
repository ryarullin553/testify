# Generated by Django 4.1.7 on 2023-07-06 06:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tests', '0001_initial'),
        ('passages', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='passage',
            name='test',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='passages', to='tests.test', verbose_name='Тест'),
        ),
    ]
