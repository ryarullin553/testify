from django.db import models
from django.db.models import OuterRef, Exists, Subquery

from bookmarks.models import Bookmark
from passages.models import Passage


class TestManager(models.Manager):
    def for_catalog(self, fields, user_id):
        passage = Passage.objects.filter(
            test_id=OuterRef('pk'),
            user_id=user_id,
            result__isnull=True
        ).only('id')
        bookmark = Bookmark.objects.filter(
            test_id=OuterRef('pk'),
            user_id=user_id
        )
        return self \
            .filter(is_published=True) \
            .select_related('user') \
            .annotate(
                in_bookmarks=Exists(bookmark),
                passage_id=Subquery(passage.values('id'))
            ) \
            .only(*fields)

    def passed(self, user_id):
        fields = ['id', 'title', 'image']
        return self \
            .filter(passages__user_id=user_id) \
            .only(*fields) \
            .distinct()
