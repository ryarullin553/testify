from rest_framework import permissions


class IsTestAuthor(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in ('GET', 'POST', 'HEAD', 'OPTIONS'):
            return True
        return obj.user == request.user
