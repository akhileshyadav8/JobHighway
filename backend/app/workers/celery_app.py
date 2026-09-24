import os
from celery import Celery
from celery.schedules import crontab
from app.config import settings

celery_app = Celery(
    "jobhighway_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.workers.fetcher", "app.workers.normalizer"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# Example beat schedule - poll all companies every 10 minutes
# Actually we can have a master task that triggers fetcher for each company
celery_app.conf.beat_schedule = {
    "poll-companies-every-10-minutes": {
        "task": "app.workers.fetcher.dispatch_company_polling",
        "schedule": crontab(minute=f"*/10"),
    },
}
