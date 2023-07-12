from rest_framework import viewsets, mixins
from rest_framework.generics import get_object_or_404

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

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        question_id = self.kwargs[self.lookup_field]
        obj = get_object_or_404(queryset, question_id=question_id, user_id=self.request.user.id)
        self.check_object_permissions(self.request, obj)
        return obj
