from django.contrib.auth import views
from django.urls import path
from django.views.generic import TemplateView
from users.views import SignUp, SignIn, VerifyEmail, RessetPassword, ChangePassword, ResetPassword

urlpatterns = [
    path('sign_up/', SignUp.as_view(), name='sign_up'),
    path('sign_in/', SignIn.as_view(), name='sign_in'),
    path('profile/', TemplateView.as_view(template_name='users/profile.html'), name='profile'),
    path('logout/', views.LogoutView.as_view(template_name='users/base.html'), name='logout'),
    path('password_reset/', ResetPassword.as_view(), name='password_reset'),
    path('password_change/', ChangePassword.as_view(), name='password_change'),
    path('password_change/done/', views.PasswordChangeDoneView.as_view(template_name='users/password_change_done.html'), name='password_change_done'),
    path('password_reset/done/', views.PasswordResetDoneView.as_view(template_name='users/password_reset_done.html'), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', RessetPassword.as_view(), name='password_reset_confirm'),
    path('reset/done/', views.PasswordResetCompleteView.as_view(template_name='users/password_change_done.html'), name='password_reset_complete'),
    path('confirm_email/', TemplateView.as_view(template_name='users/confirm_email.html'), name='confirm_email'),
    path('verify_email/<uidb64>/<token>/', VerifyEmail.as_view(), name='verify_email'),
    path('email_confirmed', TemplateView.as_view(template_name='users/email_confirmed.html'), name='email_confirmed'),
    path('email_not_confirmed', TemplateView.as_view(template_name='users/email_not_confirmed.html'), name='email_not_confirmed'),

]
