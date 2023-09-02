from django.db.models import F
from rest_framework import viewsets, mixins
from rest_framework.generics import get_object_or_404
from rest_framework.filters import OrderingFilter

from utils.permissions import UserRelationPermission
from .models import Feedback
from .serializers import FeedbackSerializer


class FeedbackAPIView(mixins.CreateModelMixin,
                      mixins.UpdateModelMixin,
                      mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    queryset = Feedback.objects
    serializer_class = FeedbackSerializer
    permission_classes = [UserRelationPermission]
    filter_backends = [OrderingFilter]
    ordering = '-created'

    def get_queryset(self):
        queryset = self.queryset \
            .annotate(
                user_name=F('user__username')
            ) \
            .defer('updated')
        return queryset

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        test_id = self.kwargs[self.lookup_field]
        instance = get_object_or_404(queryset, test_id=test_id, user_id=self.request.user.id)
        self.check_object_permissions(self.request, instance)
        return instance

    def feedbacks(self, request, *args, **kwargs):
        """
        Отзывы к тесту

        Возвращает список отзывов к тесту с пагинацией по 15 элементов
        Параметры для сортировки: created, -created
        """
        test_id = kwargs.get('pk')
        queryset = self.get_queryset() \
            .filter(
                test__id=test_id,
            )
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)
