# Generated by Django 4.1.7 on 2023-04-06 12:40

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tests', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='test',
            name='users',
            field=models.ManyToManyField(blank=True, related_name='tests', to=settings.AUTH_USER_MODEL),
        ),
    ]