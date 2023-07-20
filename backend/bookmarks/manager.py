from django.db import models


class BookmarkManager(models.Manager):
    def for_current_user(self, user_id):
        return self \
            .filter(
                user_id=user_id,
                test__is_published=True
            ) \
            .select_related('test') \
            .only('user_id', 'test_id', 'test__title', 'test__image')
