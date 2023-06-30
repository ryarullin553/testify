from django.contrib import admin
from .models import Passage


@admin.register(Passage)
class PassageAdmin(admin.ModelAdmin):
    pass

