from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS


class PassagePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.method in SAFE_METHODS or
            request.user and
            request.user.is_authenticated
        )

    def has_object_permission(self, request, view, obj):
        if request.method not in SAFE_METHODS:
            return obj.user == request.user
        else:
            return obj.test.user == request.user or obj.user == request.user

# class IsUserAnswer(permissions.BasePermission):
#     def has_permission(self, request, view):
#         result_pk = request.data.get('result')
#         result = Result.objects.get(pk=result_pk)
#         return result.user == request.user
