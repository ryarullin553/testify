from celery import shared_task
from celery_singleton import Singleton
from django.db.models import Avg, Count, F

from tests.models import Test


@shared_task(base=Singleton)
def update_test_feedback_metrics(test_id):
    test = Test.objects \
        .filter(
            id=test_id,
            is_published=True
        ) \
        .annotate(
            new_rating=Avg('feedbacks__rate'),
            new_feedbacks_count=Count('feedbacks', distinct=True)
        ) \
        .first()
    test.rating = test.new_rating
    test.feedbacks_count = test.new_feedbacks_count
    test.save()


@shared_task
def update_test_results_count(test_id):
    test = Test.objects.get(id=test_id)
    test.results_count = F('results_count') + 1
    test.save()
