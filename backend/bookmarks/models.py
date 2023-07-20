from django.db import models

from bookmarks.manager import BookmarkManager


class Bookmark(models.Model):
    created = models.DateTimeField(
        verbose_name='Создано',
        auto_now_add=True
    )
    user = models.ForeignKey(
        verbose_name='Пользователь',
        to='users.User',
        on_delete=models.CASCADE,
        related_name='bookmarks'
    )
    test = models.ForeignKey(
        verbose_name='Тест',
        to='tests.Test',
        on_delete=models.CASCADE,
        related_name='bookmarks'
    )

    objects = BookmarkManager()

    class Meta:
        verbose_name = 'Закладка'
        verbose_name_plural = 'Закладки'
        db_table = 'bookmarks'
        unique_together = ('user', 'test')
        # Заменить, когда DRF обновится до 3.15 и сможет поддерживать UniqueConstraint
        #
        # constraints = [
        #     models.UniqueConstraint(
        #         fields=('user', 'test'),
        #         name='unique_user_and_test'
        #     )
        # ]
