# Generated by Django 4.1.7 on 2023-06-01 20:48

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('results', '0002_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tests', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='result',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='choicedanswer',
            name='answer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tests.answer'),
        ),
        migrations.AddField(
            model_name='choicedanswer',
            name='result',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='results.result'),
        ),
        migrations.AlterUniqueTogether(
            name='choicedanswer',
            unique_together={('result', 'answer')},
        ),
    ]
