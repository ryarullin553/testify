from django.contrib.auth import authenticate, password_validation
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, UsernameField, SetPasswordForm, \
    PasswordChangeForm, PasswordResetForm
from django import forms
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy
from users.models import MyUser
from users.utils import send_verification_email


class SignUpForm(UserCreationForm):
    attrs = {'class': 'sign-form-input', 'autocomplete': 'off'}
    username = forms.CharField(label='', widget=forms.TextInput(attrs=attrs | {'placeholder': 'Имя и фамилия',
                                                                               'class': 'sign-form-input first-sign-form'}))
    email = forms.EmailField(label='', widget=forms.EmailInput(attrs=attrs | {'placeholder': 'E-mail'}))
    password1 = forms.CharField(label='', widget=forms.PasswordInput(attrs=attrs | {'placeholder': 'Пароль'}))
    password2 = forms.CharField(label='', widget=forms.PasswordInput(attrs=attrs | {'placeholder': 'Подтвердите пароль',
                                                                                    'class': 'sign-form-input last-sign-form'}))

    class Meta:
        model = MyUser
        fields = ['username', 'email', 'password1', 'password2']


class SignInForm(AuthenticationForm):
    username = UsernameField(widget=forms.TextInput(attrs={'autofocus': True,
                                                           'class': 'sign-form-input first-sign-form',
                                                           'placeholder': 'E-mail',
                                                           }), )
    password = forms.CharField(
        label=gettext_lazy("Password"),
        strip=False,
        widget=forms.PasswordInput(attrs={'autocomplete': 'current-password',
                                          'class': 'sign-form-input last-sign-form',
                                          'placeholder': 'Пароль',
                                          }), )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].label = 'Email'

    def clean(self):
        username = self.cleaned_data.get("username")
        password = self.cleaned_data.get("password")

        if username is not None and password:
            self.user_cache = authenticate(self.request, username=username, password=password)

            if self.user_cache is None:
                raise self.get_invalid_login_error()
            else:
                self.confirm_login_allowed(self.user_cache)

            if not self.user_cache.email_confirmed:
                send_verification_email(self.user_cache, self.request)
                raise ValidationError('Вы не подтвердили свой e-mail. Проверьте почту', code="invalid_login")

        return self.cleaned_data


class RessetPasswordForm(SetPasswordForm):
    new_password1 = forms.CharField(
        label='',
        widget=forms.PasswordInput(attrs={"autocomplete": "new-password",
                                          "class": "sign-form-input",
                                          "placeholder": "Новый пароль",
                                          }),
        strip=False,
        help_text=password_validation.password_validators_help_text_html(),
    )
    new_password2 = forms.CharField(
        label='',
        strip=False,
        widget=forms.PasswordInput(attrs={"autocomplete": "new-password",
                                          "class": "sign-form-input last-sign-form",
                                          "placeholder": "Подтвердите пароль"}),
    )


class ChangePasswordForm(RessetPasswordForm):
    old_password = forms.CharField(
        label='',
        strip=False,
        widget=forms.PasswordInput(
            attrs={"autocomplete": "current-password",
                   "autofocus": True,
                   'class': 'sign-form-input first-sign-form',
                   "placeholder": "Старый пароль",
                   }
        ),
    )


class ResetPasswordForm(PasswordResetForm):
    email = forms.EmailField(
        label='',
        max_length=254,
        widget=forms.EmailInput(attrs={'autofocus': True,
                                       'class': 'sign-form-input reset-email-input',
                                       'placeholder': 'E-mail'}),
    )

