# Generated by Django 4.1.7 on 2023-07-17 13:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('passages', '0003_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='passage',
            name='codeword',
            field=models.CharField(blank=True, max_length=40, verbose_name='Кодовое слово'),
        ),
    ]
