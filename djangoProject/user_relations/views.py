from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated

from tests.paginations import TestPagination
from .models import Bookmark, Feedback
from .permissions import IsOwner
from .serializers import BookmarkSerializer, FeedbackSerializer


class BookmarkAPIView(mixins.CreateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    queryset = Bookmark.objects
    serializer_class = BookmarkSerializer
    permission_classes = (IsAuthenticated, IsOwner)
    pagination_class = TestPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.queryset.filter(user=request.user))
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)


class FeedbackAPIView(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    queryset = Feedback.objects
    serializer_class = FeedbackSerializer
    permission_classes = (IsAuthenticated, IsOwner)
