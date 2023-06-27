# Generated by Django 4.1.7 on 2023-06-26 15:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('results', '0001_initial'),
        ('tests', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='result',
            name='test',
            field=models.ForeignKey(limit_choices_to={'is_published': True}, on_delete=django.db.models.deletion.CASCADE, related_name='results', to='tests.test'),
        ),
    ]
