from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS


class FeedbackPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        - Просмотр отзывов доступен всем пользователям
        - Создание отзыва доступен только авторизованным пользователям
        """
        return bool(
            request.method in SAFE_METHODS or
            request.user and
            request.user.is_authenticated
        )

    def has_object_permission(self, request, view, obj):
        """
        - Редактирование и удаление отзыва доступно только автору отзыва
        """
        return obj.user_id == request.user.id
