from rest_framework import permissions
from rest_framework.generics import get_object_or_404

from tests.models import Test


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