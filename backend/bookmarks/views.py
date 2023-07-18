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

    def get_queryset(self):
        queryset = self.queryset \
            .filter(
                user_id=self.request.user.id,
                test__is_published=True
            ) \
            .select_related('test') \
            .only('user_id', 'test_id', 'test__title', 'test__image')
        return queryset

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        test_id = self.kwargs[self.lookup_field]
        instance = get_object_or_404(queryset, test_id=test_id, user_id=self.request.user.id)
        self.check_object_permissions(self.request, instance)
        return instance
