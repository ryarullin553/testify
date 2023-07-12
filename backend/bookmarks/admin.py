from django.contrib import admin
from django.contrib.admin import ModelAdmin
from .models import Bookmark


@admin.register(Bookmark)
class BookmarkAdmin(ModelAdmin):
    list_display = ('id', 'test', 'user')
    list_display_links = ('id',)
    list_filter = ('user',)
    search_fields = ('id', 'test', 'user')
