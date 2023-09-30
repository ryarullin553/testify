from rest_framework import mixins, viewsets, status
from rest_framework.response import Response

from .models import Answer
from .permissions import AnswerPermission
from .serializers import AnswerSerializer


class AnswerAPIView(mixins.CreateModelMixin,
                    viewsets.GenericViewSet):
    queryset = Answer.objects.defer('created', 'updated')
    serializer_class = AnswerSerializer
    permission_classes = [AnswerPermission]

    def create(self, request, *args, **kwargs):
        """
        Создание или изменение ответа

        Если уже существует ответ с указанными question_id и passage_id, то
        изменит его содержание. В противном случае создаст ответ с указанным
        содержанием
        """
        obj = self.get_object()
        if obj:
            serializer = self.get_serializer(
                obj, data=request.data, partial=True
            )
        else:
            serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def get_object(self):
        """
        Возвращает ответ по question_id и passage_id, так как в рамках одного
        прохождения на один вопрос может быть только один ответ.
        """
        queryset = self.filter_queryset(self.get_queryset())
        question_id = self.request.data.get('question')
        passage_id = self.request.data.get('passage')
        try:
            obj = queryset.get(
                question_id=question_id, passage_id=passage_id
            )
        except queryset.model.DoesNotExist:
            return None
        self.check_object_permissions(self.request, obj)
        return obj
