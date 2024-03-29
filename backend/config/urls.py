from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from utils.yasg import urlpatterns as doc_api


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('tests.urls')),
    path('api/', include('questions.urls')),
    path('api/', include('passages.urls')),
    path('api/', include('answers.urls')),
    path('api/', include('bookmarks.urls')),
    path('api/', include('feedbacks.urls')),
    path('api/', include('comments.urls')),
    path('api/', include('likes.urls')),
]

urlpatterns += doc_api

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
