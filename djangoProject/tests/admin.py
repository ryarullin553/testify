from django.contrib import admin
from django.contrib.admin import ModelAdmin

from .models import *


@admin.register(Test)
class TestAdmin(ModelAdmin):
    pass


@admin.register(Question)
class TestQuestionAdmin(ModelAdmin):
    pass


@admin.register(Answer)
class TestAnswerAdmin(ModelAdmin):
    pass

