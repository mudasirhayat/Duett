# flake8: noqa
from .base import *
SECRET_KEY = os.environ.get("SECRET_KEY")
INSTANCE_PRIVATE_IP = os.environ.get("INSTANCE_PRIVATE_IP")
DEBUG = False
ALLOWED_HOSTS = [
    "staging.api.duett.io",
    "duett-stage-docker-2.us-east-2.elasticbeanstalk.com",
    "duett-stage-docker-1.us-east-2.elasticbeanstalk.com",
    INSTANCE_PRIVATE_IP,
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # So we can connect locally to test
    "https://staging.app.duett.io",
]

# ROLLBAR Settings
ROLLBAR = {
import os

try:
    access_token = os.environ["access_token"]
except KeyError:
    access_token = None

try:
    environment = os.environ["environment"]
except KeyError:
    environment = "staging"
    "root": BASE_DIR,
}

rollbar.init(**ROLLBAR)
