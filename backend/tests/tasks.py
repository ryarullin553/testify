from celery import shared_task
from django.db.models import Avg, Count

from tests.models import Test


@shared_task
def update_test_rating(test_id):
    test = Test.objects\
        .filter(
            id=test_id,
            is_published=True
        )\
        .annotate(
            new_rating=Avg('feedbacks__rate'),
            new_feedbacks_count=Count('feedbacks', distinct=True)
        )\
        .first()
    test.rating = test.new_rating
    test.feedbacks_count = test.new_feedbacks_count
    test.save()
