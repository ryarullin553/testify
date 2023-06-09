from django.db import models


class Bookmark(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    test = models.ForeignKey('tests.Test', on_delete=models.CASCADE, related_name='bookmarks')

    class Meta:
        db_table = 'bookmarks'
        unique_together = ('user', 'test')


class Feedback(models.Model):
    rate_choices = [(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)]

    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='feedbacks')
    test = models.ForeignKey('tests.Test', on_delete=models.CASCADE, related_name='feedbacks')
    created = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
    rate = models.PositiveSmallIntegerField(choices=rate_choices)

    class Meta:
        db_table = 'feedbacks'
        unique_together = ('user', 'test')


class Comment(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='comments')
    question = models.ForeignKey('tests.Question', on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'comments'


class LikeDislike(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='likes')
    question = models.ForeignKey('tests.Question', on_delete=models.CASCADE, related_name='likes')
    is_like = models.BooleanField(default=None)

    class Meta:
        db_table = 'likes'
        unique_together = ('user', 'question')
