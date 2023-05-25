from django.contrib import admin
from django.contrib.admin import ModelAdmin
from .models import Comment, Bookmark, LikeDislike, Feedback


@admin.register(Comment)
class CommentAdmin(ModelAdmin):
    pass


@admin.register(Bookmark)
class BookmarkAdmin(ModelAdmin):
    pass


@admin.register(LikeDislike)
class LikeDislikeAdmin(ModelAdmin):
    pass


@admin.register(Feedback)
class FeedbackAdmin(ModelAdmin):
    pass

