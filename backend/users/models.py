from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin, UserManager
import uuid


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True
    )
    username = models.CharField(
        verbose_name='Имя',
        max_length=150,
        validators=[UnicodeUsernameValidator()]
    )
    email = models.EmailField(
        verbose_name='Электронная почта',
        unique=True
    )
    is_active = models.BooleanField(
        verbose_name='Активный',
        default=True
    )
    is_staff = models.BooleanField(
        verbose_name='Администратор',
        default=False
    )
    created = models.DateTimeField(
        verbose_name='Дата регистрации',
        auto_now_add=True
    )
    image = models.ImageField(
        verbose_name='Изображение',
        upload_to='images/user_avatars/%Y/%m/%d/',
        blank=True
    )
    info = models.CharField(
        verbose_name='Краткая информация',
        max_length=140,
        blank=True
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'users'
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)
