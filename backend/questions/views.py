from rest_framework import mixins, viewsets

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

    # @action(detail=False, methods=['POST'], url_path='generated', url_name='generated',
    #         permission_classes=[IsAuthenticated])
    # def generate_wrong_answers(self, request):
    #     wrong_answers = get_wrong_answers(request.data)
    #     return Response({"answer_set": wrong_answers})
