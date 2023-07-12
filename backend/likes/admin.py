from django.contrib import admin
from django.contrib.admin import ModelAdmin
from .models import Like


@admin.register(Like)
class LikeAdmin(ModelAdmin):
    list_display = ('id', 'user', 'question', 'is_like')
    list_display_links = ('id',)
    list_filter = ('user', 'question')
    search_fields = ('id',)

