# Generated by Django 4.1.7 on 2023-05-17 13:10

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tests', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='test',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_tests', to=settings.AUTH_USER_MODEL, verbose_name='Автор'),
        ),
    ]