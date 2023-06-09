from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('/admin', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('tests.urls')),
    path('api/', include('results.urls')),
    path('api/', include('user_relations.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
