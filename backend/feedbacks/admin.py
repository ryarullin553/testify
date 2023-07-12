from django.contrib import admin
from django.contrib.admin import ModelAdmin
from .models import Feedback


@admin.register(Feedback)
class FeedbackAdmin(ModelAdmin):
    list_display = ('id', 'test', 'user')
    list_display_links = ('id',)
    list_filter = ('test',)
    search_fields = ('id', 'test', 'user')
