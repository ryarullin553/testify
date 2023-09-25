from rest_framework import viewsets, mixins
from rest_framework.generics import get_object_or_404
from rest_framework.filters import OrderingFilter, SearchFilter

from utils.permissions import UserRelationPermission
from .models import Bookmark
from .serializers import BookmarkSerializer


class BookmarkAPIView(mixins.CreateModelMixin,
                      mixins.ListModelMixin,
                      mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    queryset = Bookmark.objects
    serializer_class = BookmarkSerializer
    permission_classes = [UserRelationPermission]
    filter_backends = [OrderingFilter, SearchFilter]
    search_fields = ['test__title']
    ordering = '-created'
    lookup_field = 'test_id'

    def get_queryset(self):
        current_user_id = self.request.user.id
        return self.queryset.for_current_user(current_user_id)

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        test_id = self.kwargs[self.lookup_field]
        instance = get_object_or_404(queryset, test_id=test_id, user_id=self.request.user.id)
        self.check_object_permissions(self.request, instance)
        return instance
