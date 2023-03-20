from django.contrib.auth import authenticate, login
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.views import LoginView, PasswordResetConfirmView, PasswordChangeView, PasswordResetView
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.utils.http import urlsafe_base64_decode
from django.views import View
from django.views.generic import CreateView
from django.utils.encoding import force_str
from users.forms import SignUpForm, SignInForm, RessetPasswordForm, ChangePasswordForm, ResetPasswordForm
from users.models import MyUser


class SignUp(CreateView):
    form_class = SignUpForm
    template_name = 'users/sign_up.html'
    extra_context = {'title': 'Регистрация', 'selected': 'sign-up'}
    success_url = reverse_lazy('confirm_email')


class SignIn(LoginView):
    form_class = SignInForm
    template_name = 'users/sign_in.html'
    extra_context = {'title': 'Войти', 'selected': 'sign-in'}

    def get_success_url(self):
        return reverse_lazy('base_page')


class VerifyEmail(View):
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = MyUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, MyUser.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.email_confirmed = True
            user.save()
            login(request, user)
            return redirect('email_confirmed')
        else:
            return redirect('email_not_confirmed')


class RessetPassword(PasswordResetConfirmView):
    form_class = RessetPasswordForm
    template_name = 'users/password_reset_confirm.html'


class ChangePassword(PasswordChangeView):
    form_class = ChangePasswordForm
    template_name = 'users/password_change.html'


class ResetPassword(PasswordResetView):
    form_class = ResetPasswordForm
    template_name = 'users/password_reset.html'
