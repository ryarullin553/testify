from django.shortcuts import get_object_or_404
from rest_framework import permissions

from tests.models import Test


class IsTestAuthor(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in ('GET', 'POST', 'HEAD', 'OPTIONS'):
            return True
        return obj.user == request.user


class IsQuestionAuthor(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return get_object_or_404(Test, pk=request.data['test']).user == request.user
        return True

    def has_object_permission(self, request, view, obj):
        if request.method in ('PATCH', 'PUT', 'DELETE'):
            return obj.test.user == request.user
        else:
            return True
