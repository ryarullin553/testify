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
            return obj.user_id == request.user.id
        else:
            return obj.test.user_id == request.user.id or obj.user_id == request.user.id
