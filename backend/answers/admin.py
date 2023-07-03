from django.contrib import admin
from django.contrib.admin import ModelAdmin

from answers.models import Answer


@admin.register(Answer)
class AnswerAdmin(ModelAdmin):
    list_display = ('id', '__str__')
    list_display_links = ('id', '__str__')
    list_filter = ()
    search_fields = ('id', 'passage')
