from django.contrib import admin
from django.contrib.admin import ModelAdmin
from .models import Comment


@admin.register(Comment)
class CommentAdmin(ModelAdmin):
    list_display = ('id', 'user', 'question', 'comment')
    list_display_links = ('id',)
    list_filter = ('question', 'comment')
    search_fields = ('id', 'user', 'content')
