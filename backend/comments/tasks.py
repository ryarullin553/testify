from celery import shared_task
from celery_singleton import Singleton
from django.db.models import Count, Q

from comments.models import Comment


@shared_task(base=Singleton)
def update_comment_metrics(comment_id):
    comment = Comment.objects \
        .filter(
            id=comment_id
        ) \
        .annotate(
            new_likes_count=Count('likes', filter=Q(likes__is_like=True)),
            new_dislikes_count=Count('likes', filter=Q(likes__is_like=False))
        ) \
        .first()
    comment.likes_count = comment.new_likes_count
    comment.dislikes_count = comment.new_dislikes_count
    comment.save()
