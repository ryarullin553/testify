from django.contrib import admin
from django.contrib.admin import ModelAdmin
from test_results.models import Result, ChoicedAnswer


@admin.register(Result)
class ResultAdmin(ModelAdmin):
    pass


@admin.register(ChoicedAnswer)
class ChoicedAnswerAdmin(ModelAdmin):
    pass
