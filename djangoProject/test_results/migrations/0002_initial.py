# Generated by Django 4.1.7 on 2023-04-25 15:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tests', '0001_initial'),
        ('test_results', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='result',
            name='test',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tests.test'),
        ),
    ]
