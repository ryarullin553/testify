from django.contrib import admin
from django.contrib.admin import ModelAdmin
from .models import User


@admin.register(User)
class UserAdmin(ModelAdmin):
    list_display = ('email', 'username', 'is_active', 'is_staff', 'created')
    list_display_links = ('email', 'username')
    list_editable = ('is_active', 'is_staff')
    list_filter = ('is_active', 'is_staff')
    search_fields = ('email', 'username')


