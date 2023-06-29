# from rest_framework import permissions
# from .models import Result
#
#
# class IsUserResult(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         if request.method == 'POST':
#             return True
#         return obj.user == request.user
#
#
# class IsUserAnswer(permissions.BasePermission):
#     def has_permission(self, request, view):
#         result_pk = request.data.get('result')
#         result = Result.objects.get(pk=result_pk)
#         return result.user == request.user


