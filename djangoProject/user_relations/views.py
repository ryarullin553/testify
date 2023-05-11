from rest_framework import viewsets, mixins
from .models import Bookmark
from .serializers import BookmarkSerializer


class BookmarkAPIView(mixins.CreateModelMixin, mixins.DestroyModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Bookmark.objects
    serializer_class = BookmarkSerializer

