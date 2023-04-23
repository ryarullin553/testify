from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _

from tests.models import *


class MyUser(AbstractUser):
    username = models.CharField(_("username"), max_length=40)
    email = models.EmailField(_('email address'), unique=True)
    avatar = models.ImageField(upload_to='images/user_avatars/%Y/%m/%d/', blank=True, null=True)
    bio = models.CharField(max_length=140, blank=True, null=True)
    first_name = None
    last_name = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'avatar']


class Comment(models.Model):
    author = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    content = models.TextField()
    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)


class Bookmark(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)


class LikeDislike(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    is_like = models.BooleanField(default=None)


class Feedback(models.Model):
    rate_choices = [(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)]

    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    content = models.TextField()
    rate = models.PositiveSmallIntegerField(choices=rate_choices)


