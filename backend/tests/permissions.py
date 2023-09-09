from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS


class CatalogPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        - Просмотр каталога доступен всем пользователям
        - Создание теста доступно только авторизованным пользователям
        - Просмотр своих пройденных тестов доступен всем пользователям
        """
        return bool(
            request.method in SAFE_METHODS or
            request.user and
            request.user.is_authenticated
        )

    def has_object_permission(self, request, view, obj):
        """
        - Просмотр страницы теста доступен всем пользователям
        - Редактирование и удаление теста доступно только автору теста
        """
        if request.method in SAFE_METHODS:
            return True
        return obj.user_id == request.user.id


class TestPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        - Просмотр статистики теста доступен только автору теста
        - Просмотр вопросов теста доступен только автору теста
        - Просмотр настроек теста доступен только автору теста
        """
        instance = view.get_object()
        return instance.user_id == request.user.id

    def has_object_permission(self, request, view, obj):
        return obj.user_id == request.user.id
