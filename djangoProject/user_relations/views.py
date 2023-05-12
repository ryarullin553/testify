from django.http import JsonResponse
from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter

from tests.paginations import TestPagination
from .models import Bookmark, Feedback, Comment, LikeDislike
from .permissions import IsOwner
from .serializers import BookmarkSerializer, FeedbackSerializer, CommentSerializer, LikeDislikeSerializer


class BookmarkAPIView(mixins.CreateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    queryset = Bookmark.objects
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated, IsOwner]
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
    permission_classes = [IsAuthenticated, IsOwner]


class CommentAPIView(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                     viewsets.GenericViewSet):
    queryset = Comment.objects
    serializer_class = CommentSerializer
    filter_backends = [OrderingFilter, ]
    permission_classes = [IsAuthenticated, IsOwner]
    ordering_fields = ['time_create']
    pagination_class = TestPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.queryset.filter(question=request.data['question_id']))
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)


class LikeDislikeAPIView(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                         viewsets.GenericViewSet):
    queryset = LikeDislike.objects
    serializer_class = LikeDislikeSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def list(self, request, *args, **kwargs):
        queryset = self.queryset.filter(question=request.data['question_id'])
        likes = queryset.filter(is_like=True).count()
        dislikes = queryset.filter(is_like=False).count()
        return JsonResponse({'likes': likes, 'dislikes': dislikes})

