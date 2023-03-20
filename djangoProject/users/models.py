from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _


class MyUser(AbstractUser):
    username = models.CharField(_("username"), max_length=150)
    email = models.EmailField(_('email address'), unique=True)
    email_confirmed = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    # Добавить поле с аватаром
    # Добавить поле со списком опубликованных статей
    # Добавить поле с поставленными лайками
    # Добавить поле с комментариями

