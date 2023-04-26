from rest_framework import permissions


class IsTestAuthor(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in ('GET', 'POST', 'HEAD', 'OPTIONS'):
            return True
        print(obj.author == request.user)
        return obj.author == request.user


class IsQuestionAuthor(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in ('GET', 'POST', 'HEAD', 'OPTIONS'):
            return obj.author == request.user
        else:
            return obj.test.author == request.user
