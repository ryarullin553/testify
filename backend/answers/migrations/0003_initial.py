# Generated by Django 4.1.7 on 2023-07-06 06:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('answers', '0002_initial'),
        ('questions', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='questions.question', verbose_name='Вопрос'),
        ),
        migrations.AlterUniqueTogether(
            name='answer',
            unique_together={('passage', 'question')},
        ),
    ]
