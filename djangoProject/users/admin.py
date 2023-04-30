from django.contrib import admin
from django.contrib.admin import ModelAdmin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import User, Comment, Bookmark, LikeDislike, Feedback


@admin.register(User)
class UserAdmin(UserAdmin):
    pass


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
