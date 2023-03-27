from django.contrib import admin
from django.contrib.admin import ModelAdmin

from .models import *


@admin.register(Test)
class TestAdmin(ModelAdmin):
    pass


@admin.register(TestQuestion)
class TestQuestionAdmin(ModelAdmin):
    pass


@admin.register(TestAnswer)
class TestAnswerAdmin(ModelAdmin):
    pass


@admin.register(TestResult)
class TestResultAdmin(ModelAdmin):
    pass
