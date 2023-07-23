import os

from celery import Celery
from django.conf import settings


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('backend')
app.config_from_object('django.conf:settings')
app.conf.broker_url = settings.CELERY_BROKER_URL
app.conf.task_routes = {
    'tests.tasks.*': {
        'queue': 'tests'
    }
}
app.conf.broker_connection_retry_on_startup = True
app.autodiscover_tasks()

