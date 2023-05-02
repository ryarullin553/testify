# Generated by Django 4.1.7 on 2023-05-02 14:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tests', '0001_initial'),
        ('results', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='result',
            name='test',
            field=models.ForeignKey(limit_choices_to={'is_published': True}, on_delete=django.db.models.deletion.CASCADE, to='tests.test'),
        ),
    ]
