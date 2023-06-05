from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    username = models.CharField(_("username"), max_length=40)
    email = models.EmailField(_('email address'), unique=True)
    avatar = models.ImageField(upload_to='images/user_avatars/%Y/%m/%d/', blank=True, null=True)
    bio = models.CharField(max_length=140, blank=True, null=True)
    first_name = None
    last_name = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'avatar']

    class Meta:
        db_table = 'users'
