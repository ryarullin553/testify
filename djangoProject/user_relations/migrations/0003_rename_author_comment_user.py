# Generated by Django 4.1.7 on 2023-05-12 14:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_relations', '0002_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='author',
            new_name='user',
        ),
    ]
