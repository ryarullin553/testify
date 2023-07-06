from django.db.models import F, ExpressionWrapper
from rest_framework import viewsets, mixins
from rest_framework.generics import get_object_or_404
from rest_framework.filters import OrderingFilter
from rest_framework.response import Response

from .models import Bookmark, Feedback, Comment, Like
from .permissions import UserRelationPermission
from .serializers import BookmarkSerializer, FeedbackSerializer, CommentSerializer, LikeSerializer


class BookmarkAPIView(mixins.CreateModelMixin,
                      mixins.ListModelMixin,
                      mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    queryset = Bookmark.objects
    serializer_class = BookmarkSerializer
    permission_classes = [UserRelationPermission]
    filter_backends = [OrderingFilter]
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


class FeedbackAPIView(mixins.CreateModelMixin,
                      mixins.UpdateModelMixin,
                      mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    queryset = Feedback.objects
    serializer_class = FeedbackSerializer
    permission_classes = [UserRelationPermission]

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        test_id = self.kwargs[self.lookup_field]
        instance = get_object_or_404(queryset, test_id=test_id, user_id=self.request.user.id)
        self.check_object_permissions(self.request, instance)
        return instance


class CommentAPIView(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                     viewsets.GenericViewSet):
    queryset = Comment.objects
    serializer_class = CommentSerializer
    permission_classes = [UserRelationPermission]


class LikeAPIView(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                  viewsets.GenericViewSet):
    queryset = Like.objects
    serializer_class = LikeSerializer
    permission_classes = [UserRelationPermission]

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
