from celery import shared_task
from celery_singleton import Singleton
from django.db.models import Count, Q

from questions.models import Question


@shared_task(base=Singleton)
def update_question_metrics(question_id):
    question = Question.objects \
        .filter(
            id=question_id
        ) \
        .annotate(
            new_likes_count=Count('likes', filter=Q(likes__is_like=True)),
            new_dislikes_count=Count('likes', filter=Q(likes__is_like=False))
        ) \
        .first()
    question.likes_count = question.new_likes_count
    question.dislikes_count = question.new_dislikes_count
    question.save()
