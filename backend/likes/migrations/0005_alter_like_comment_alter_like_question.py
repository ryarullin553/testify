# Generated by Django 4.2.3 on 2023-07-20 11:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0004_comment_dislikes_count_comment_likes_count'),
        ('questions', '0003_question_dislikes_count_question_likes_count'),
        ('likes', '0004_alter_like_comment_alter_like_question'),
    ]

    operations = [
        migrations.AlterField(
            model_name='like',
            name='comment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='comments.comment', verbose_name='Комментарий'),
        ),
        migrations.AlterField(
            model_name='like',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='questions.question', verbose_name='Вопрос'),
        ),
    ]
