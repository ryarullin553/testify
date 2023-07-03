from django.contrib import admin
from django.contrib.admin import ModelAdmin

from .models import Question


@admin.register(Question)
class QuestionAdmin(ModelAdmin):
    list_display = ('id', '__str__', 'type')
    list_display_links = ('id', '__str__')
    list_filter = ('test',)
    search_fields = ('id', 'test')

