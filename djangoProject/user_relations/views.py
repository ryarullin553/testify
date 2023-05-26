from rest_framework import viewsets, mixins
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter

from .models import Bookmark, Feedback, Comment, LikeDislike
from .permissions import IsOwner
from .serializers import BookmarkSerializer, FeedbackSerializer, CommentSerializer, LikeDislikeSerializer


class BookmarkAPIView(mixins.CreateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    queryset = Bookmark.objects
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    filter_backends = [OrderingFilter]
    ordering = 'id'

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.queryset.filter(user=request.user))
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())

        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        assert lookup_url_kwarg in self.kwargs, (
                'Expected view %s to be called with a URL keyword argument '
                'named "%s". Fix your URL conf, or set the `.lookup_field` '
                'attribute on the view correctly.' %
                (self.__class__.__name__, lookup_url_kwarg)
        )

        test_id = self.kwargs[lookup_url_kwarg]
        obj = get_object_or_404(queryset, test=test_id, user=self.request.user)
        self.check_object_permissions(self.request, obj)
        return obj


class FeedbackAPIView(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    queryset = Feedback.objects
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated, IsOwner]


class CommentAPIView(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                     viewsets.GenericViewSet):
    queryset = Comment.objects
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsOwner]


class LikeAPIView(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                  viewsets.GenericViewSet):
    queryset = LikeDislike.objects
    serializer_class = LikeDislikeSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())

        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        assert lookup_url_kwarg in self.kwargs, (
                'Expected view %s to be called with a URL keyword argument '
                'named "%s". Fix your URL conf, or set the `.lookup_field` '
                'attribute on the view correctly.' %
                (self.__class__.__name__, lookup_url_kwarg)
        )

        question_id = self.kwargs[lookup_url_kwarg]
        obj = get_object_or_404(queryset, question=question_id, user=self.request.user)
        self.check_object_permissions(self.request, obj)
        return obj
