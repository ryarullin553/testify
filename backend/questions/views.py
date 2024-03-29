from rest_framework import mixins, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Question
from .permissions import QuestionPermission
from .serializers import QuestionSerializer


class QuestionAPIView(mixins.CreateModelMixin,
                      mixins.UpdateModelMixin,
                      mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    queryset = Question.objects
    serializer_class = QuestionSerializer
    permission_classes = [QuestionPermission]

    @action(detail=True, methods=['POST'], url_path='copy', url_name='copy')
    def copy(self, request, **kwargs):
        instance = self.get_object()
        self.get_queryset().create_copy(instance)
        return Response(status=status.HTTP_201_CREATED)
