from rest_framework import permissions


class IsQuestionAuthor(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in ('PATCH', 'PUT', 'DELETE'):
            return obj.test.user == request.user
        else:
            return True
