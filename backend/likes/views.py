from rest_framework import viewsets, mixins, status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from utils.permissions import UserRelationPermission
from .models import Like
from .serializers import LikeSerializer


class LikeAPIView(mixins.CreateModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.DestroyModelMixin,
                  viewsets.GenericViewSet):
    queryset = Like.objects
    serializer_class = LikeSerializer
    permission_classes = [UserRelationPermission]
    lookup_field = 'question_id'

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        question_id = self.kwargs[self.lookup_field]
        obj = get_object_or_404(
            queryset=queryset,
            question_id=question_id,
            user_id=self.request.user.id
        )
        self.check_object_permissions(self.request, obj)
        return obj

    def update_comment_like(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        comment_id = self.kwargs['comment_id']
        instance = get_object_or_404(
            queryset=queryset,
            comment_id=comment_id,
            user_id=self.request.user.id
        )
        serializer = self.get_serializer(
            instance, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def delete_comment_like(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        comment_id = self.kwargs['comment_id']
        instance = get_object_or_404(
            queryset=queryset,
            comment_id=comment_id,
            user_id=self.request.user.id
        )
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
