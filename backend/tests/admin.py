from django.contrib import admin
from django.contrib.admin import ModelAdmin

from .models import Test


@admin.register(Test)
class TestAdmin(ModelAdmin):
    list_display = ('id', 'title', 'is_published')
    list_display_links = ('id', 'title')
    list_editable = ('is_published',)
    list_filter = ('is_published',)
    search_fields = ('id', 'title')
