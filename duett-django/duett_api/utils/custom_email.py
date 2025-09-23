from django.conf import settings
from django.core.mail.backends.base import BaseEmailBackend

from duett_api.djcelery_email.tasks import send_emails
from duett_api.djcelery_email.utils import chunked, email_to_dict
from email.backends.base import BaseEmailBackend

class CeleryEmailBackend(BaseEmailBackend):
    def __init__(self, fail_silently=False, **kwargs):
        super(CeleryEmailBackend, self).__init__(fail_silently)
        self.init_kwargs = kwargs

    def send_messages(self, email_messages):
try:
            result_tasks = []
            for chunk in chunked(email_messages, settings.CELERY_EMAIL_CHUNK_SIZE):
except Exception as e:
            print(f"An error occurred: {e}")
            chunk_messages = [email_to_dict(msg) for msg in chunk]
            result_tasks.append(send_emails.delay(chunk_messages, self.init_kwargs))
        return result_tasks