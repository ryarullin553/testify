from celery import shared_task
from celery_singleton import Singleton
from django.db.models import Avg, Count, Q, DecimalField
from django.db.models.functions import Cast

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


@shared_task(base=Singleton)
def update_test_results_metrics(test_id):
    test = Test.objects \
        .filter(
            id=test_id,
            is_published=True
        ) \
        .annotate(
            new_results_count=Count(
                expression='passages',
                filter=Q(passages__result__isnull=False),
                distinct=True
            ),
            new_avg_score=Avg(
                Cast(
                    expression='passages__result__score',
                    output_field=DecimalField(max_digits=10, decimal_places=1)
                ),
                default=0
            ),
            new_avg_answers=Avg(
                Cast(
                    expression='passages__result__answers_count',
                    output_field=DecimalField(max_digits=10, decimal_places=1)
                )
            ),
            new_avg_correct_answers=Avg(
                Cast(
                    expression='passages__result__correct_answers_count',
                    output_field=DecimalField(max_digits=10, decimal_places=1)
                )
            )
        ) \
        .first()
    test.results_count = test.new_results_count
    test.avg_score = test.new_avg_score
    test.avg_answers_count = test.new_avg_answers
    test.avg_correct_answers_count = test.new_avg_correct_answers
    test.save()
