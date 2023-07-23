# Generated by Django 4.2.3 on 2023-07-23 15:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('passages', '0001_initial'),
        ('answers', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='passage',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='passages.passage', verbose_name='Прохождение'),
        ),
    ]
