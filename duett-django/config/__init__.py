from __future__ import absolute_import, unicode_literals

# This will make sure the app is always imported when
# Django starts so that shared_task will use this app.
import logging

try:
    from config.settings.celery import app as celery_app
except ImportError as e:
    logging.error(f"Failed to import Celery app: {e}")
    celery_app = None

__all__