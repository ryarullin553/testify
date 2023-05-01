from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='users/main-page.html')),

    path('', include('users.urls')),
    path('api/', include('tests.urls')),
    path('api/', include('results.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
