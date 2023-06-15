from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from user_relations.serializers import CommentSerializer
from .models import Question
from .permissions import IsQuestionAuthor
from .serializers import QuestionSerializer
from .services import get_wrong_answers


class QuestionAPIView(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    queryset = Question.objects
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated, IsQuestionAuthor]

    @action(detail=True, url_path='likes', url_name='likes')
    def get_question_likes(self, request, **kwargs):
        question = self.get_object()
        fields = ('likes', 'dislikes', 'is_like')
        serializer = self.get_serializer(question, fields=fields)
        return Response(serializer.data)

    @action(detail=True, url_path='comments', url_name='comments')
    def get_question_comments(self, request, **kwargs):
        question = self.get_object()
        page = self.paginate_queryset(question.comments)
        serializer = CommentSerializer(page, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)

    @action(detail=False, methods=['POST'], url_path='generated', url_name='generated',
            permission_classes=[IsAuthenticated])
    def generate_wrong_answers(self, request):
        wrong_answers = get_wrong_answers(request.data)
        return Response({"answer_set": wrong_answers})
