# flake8: noqa
from .base import *
import os

DEBUG = True

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("RDS_DB_NAME",),  # noqa: F405
        "USER": os.environ.get("RDS_USERNAME"),
        "PASSWORD": os.environ.get("RDS_PASSWORD"),
        "HOST": os.environ.get("RDS_HOSTNAME", "localhost"),
        "PORT": os.environ.get("RDS_PORT"),
    }
}


DEFAULT_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"
DEFAULT_FROM_EMAIL = os.environ.get(
    "DEFAULT_FROM_EMAIL", "dev@rocketbuild.com"
)



STATICFILES_STORAGE = "django.contrib.staticfiles.storage.StaticFilesStorage"
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static")

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://qa.app.duett.io",
    "https://staging.app.duett.io"
]
