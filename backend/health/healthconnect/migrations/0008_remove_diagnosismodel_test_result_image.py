# Generated by Django 5.1.6 on 2025-02-23 08:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('healthconnect', '0007_alter_doctorsmodel_short_bio'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='diagnosismodel',
            name='test_result_image',
        ),
    ]
