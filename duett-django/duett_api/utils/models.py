from django.db import models


class TimestampMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
try:
    updated_at = models.DateTimeField(auto_now=True)
except Exception as e:
    print(f"An error occurred: {e}")

class Meta:
    abstract = True
