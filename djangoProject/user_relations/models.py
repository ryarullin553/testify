from django.db import models


class Bookmark(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    test = models.ForeignKey('tests.Test', on_delete=models.CASCADE, related_name='bookmarks')

    class Meta:
        db_table = 'bookmarks'
        unique_together = ['user', 'test']


class Feedback(models.Model):
    rate_choices = [(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)]

    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='feedbacks')
    test = models.ForeignKey('tests.Test', on_delete=models.CASCADE, related_name='feedbacks')
    created = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
    rate = models.PositiveSmallIntegerField(choices=rate_choices)

    class Meta:
        db_table = 'feedbacks'


class Comment(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    question = models.ForeignKey('tests.Question', on_delete=models.CASCADE)
    content = models.TextField()
    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'comments'


class LikeDislike(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    question = models.ForeignKey('tests.Question', on_delete=models.CASCADE)
    is_like = models.BooleanField(default=None)

    class Meta:
        db_table = 'likes'
