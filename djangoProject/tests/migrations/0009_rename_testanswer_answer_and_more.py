# Generated by Django 4.1.7 on 2023-04-11 09:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_remove_likedislike_is_dislike'),
        ('tests', '0008_alter_test_is_published'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='TestAnswer',
            new_name='Answer',
        ),
        migrations.RenameModel(
            old_name='TestQuestion',
            new_name='Question',
        ),
    ]
