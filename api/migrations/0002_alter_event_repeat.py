# Generated by Django 3.2.5 on 2021-07-17 20:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='repeat',
            field=models.DurationField(blank=True, null=True),
        ),
    ]
