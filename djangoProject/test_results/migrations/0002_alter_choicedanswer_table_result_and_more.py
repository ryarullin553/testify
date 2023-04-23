# Generated by Django 4.1.7 on 2023-04-23 19:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tests', '0010_remove_testresultanswer_answer_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('test_results', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='choicedanswer',
            table='choiced_answer',
        ),
        migrations.CreateModel(
            name='Result',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_finished', models.BooleanField(default=False)),
                ('time_create', models.DateTimeField(auto_now_add=True)),
                ('time_update', models.DateTimeField(auto_now=True)),
                ('test', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tests.test')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'result',
            },
        ),
        migrations.AlterField(
            model_name='choicedanswer',
            name='result',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='test_results.result'),
        ),
        migrations.DeleteModel(
            name='TestResult',
        ),
    ]
