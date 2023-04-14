from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from tests.views import *


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='users/main-page.html')),

    path('', include('users.urls')),
    path('api/', include('tests.urls')),
]
