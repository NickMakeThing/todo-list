# Generated by Django 3.0.8 on 2020-08-01 00:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todolist', '0003_auto_20200725_2209'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='completed',
            field=models.BooleanField(default=False),
        ),
    ]
