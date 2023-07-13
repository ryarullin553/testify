from rest_framework import mixins, viewsets, status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
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
        queryset = self.get_queryset()
        instance = get_object_or_404(queryset, pk=self.kwargs[self.lookup_field])
        self.queryset.create(
            test_id=instance.test_id,
            type=instance.type,
            content=instance.content,
            answer_choices=instance.answer_choices,
            right_answers=instance.right_answers,
            points=instance.points,
            explanation=instance.explanation,
            image=instance.image
        )
        return Response(status=status.HTTP_201_CREATED)

