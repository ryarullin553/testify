from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter

from utils.permissions import UserRelationPermission
from .models import Comment
from .serializers import CommentSerializer


class CommentAPIView(mixins.CreateModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin,
                     viewsets.GenericViewSet):
    queryset = Comment.objects
    serializer_class = CommentSerializer
    permission_classes = [UserRelationPermission]
    filter_backends = [OrderingFilter]
    ordering_fields = ['created']
    ordering = '-created'

    def get_queryset(self):
        queryset = self.queryset \
            .select_related('user') \
            .only('user_id', 'question_id', 'user__username', 'user__image', 'created', 'content')
        return queryset

    def comments(self, request, *args, **kwargs):
        question_id = kwargs.get('pk')
        queryset = self.get_queryset() \
            .filter(
                question_id=question_id
            )
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=True)
    def replies(self, request, *args, **kwargs):
        comment_id = kwargs.get('pk')
        queryset = self.get_queryset() \
            .filter(
                comment_id=comment_id
            )
        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)
