from django.contrib import admin
from .models import Passage


@admin.register(Passage)
class PassageAdmin(admin.ModelAdmin):
    list_display = ('id', '__str__', 'result')
    list_display_links = ('id', '__str__')
    list_filter = ('test', 'user')
    search_fields = ('id', 'test', 'user')

