# Generated by Django 5.1.6 on 2025-02-23 01:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('healthconnect', '0003_remove_doctorsmodel_availability_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='doctorrecommendation',
            name='availability',
        ),
        migrations.RemoveField(
            model_name='doctorrecommendation',
            name='qualifications',
        ),
    ]
