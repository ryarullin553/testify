from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from djangoProject import settings
from users.models import MyUser


@receiver(post_save, sender=MyUser)
def send_verification_email(instance, created, **kwargs):
    if created:
        token = default_token_generator.make_token(instance)
        uid = urlsafe_base64_encode(force_bytes(instance.pk))
        subject = 'Подтверждение электронной почты'
        link = f'{settings.BASE_URL}/verify_email/{uid}/{token}/'
        message = f'Добро пожаловать, {instance.username}! Чтобы подтвердить свой аккаунт, перейдите по ссылке: {link}'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [instance.email]
        send_mail(subject, message, from_email, recipient_list, fail_silently=False)