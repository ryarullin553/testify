from django.contrib import admin
from django.contrib.admin import ModelAdmin

from .models import Test


@admin.register(Test)
class TestAdmin(ModelAdmin):
    pass
