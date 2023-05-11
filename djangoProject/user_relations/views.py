from rest_framework import viewsets, mixins
from .models import Bookmark, Feedback
from .serializers import BookmarkSerializer, FeedbackSerializer


class BookmarkAPIView(mixins.CreateModelMixin, mixins.DestroyModelMixin, mixins.ListModelMixin,
                      viewsets.GenericViewSet):
    queryset = Bookmark.objects
    serializer_class = BookmarkSerializer


class FeedbackAPIView(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    queryset = Feedback.objects
    serializer_class = FeedbackSerializer
