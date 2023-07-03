from rest_framework import mixins, viewsets

from .models import Answer
from .permissions import AnswerPermission
from .serializers import AnswerSerializer


class AnswerAPIView(mixins.CreateModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    viewsets.GenericViewSet):
    queryset = Answer.objects\
        .defer('created', 'updated')
    serializer_class = AnswerSerializer
    permission_classes = [AnswerPermission]

