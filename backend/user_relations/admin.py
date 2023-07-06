from django.contrib import admin
from django.contrib.admin import ModelAdmin
from .models import Bookmark, Feedback, Comment, Like


@admin.register(Bookmark)
class BookmarkAdmin(ModelAdmin):
    list_display = ('id', 'test', 'user')
    list_display_links = ('id',)
    list_filter = ('user',)
    search_fields = ('id', 'test', 'user')


@admin.register(Feedback)
class FeedbackAdmin(ModelAdmin):
    list_display = ('id', 'test', 'user')
    list_display_links = ('id',)
    list_filter = ('test',)
    search_fields = ('id', 'test', 'user')


@admin.register(Comment)
class CommentAdmin(ModelAdmin):
    list_display = ('id', 'user', 'question', 'comment')
    list_display_links = ('id',)
    list_filter = ('question', 'comment')
    search_fields = ('id', 'user', 'content')


@admin.register(Like)
class LikeAdmin(ModelAdmin):
    list_display = ('id', 'user', 'question', 'is_like')
    list_display_links = ('id',)
    list_filter = ('user', 'question')
    search_fields = ('id',)
