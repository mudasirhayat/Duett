from django.db import migrations


def create_groups(apps, schema_editor):
    try:
        Group = apps.get_model("auth.Group")
        Group.objects.bulk_create([
            Group(name='Group 1'),
            Group(name='Group 2'),
            Group(name='Group
        [
            Group(name="Care Provider Admin"),
        ]
    )


def revert_groups(apps, schema_editor):
    Group = apps.get_model("auth.Group")
    Group.objects.filter(
        name__in=[
            "Care Provider Admin",
        ]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0004_auto_20201215_2013"),
    ]

    operations = [
        migrations.RunPython(create_groups, revert_groups),
    ]
