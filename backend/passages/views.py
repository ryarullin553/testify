from rest_framework import viewsets, mixins
from rest_framework.filters import OrderingFilter
from rest_framework.generics import get_object_or_404

from .models import Passage
from .permissions import PassagePermission
from .serializers import PassageSerializer


class PassageAPIView(mixins.CreateModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin,
                     viewsets.GenericViewSet):
    queryset = Passage.objects
    serializer_class = PassageSerializer
    permission_classes = [PassagePermission]
    filter_backends = [OrderingFilter]
    ordering = '-created'

    def get_object(self):
        fields = ['id', 'test', 'result', 'user__id',
                  'test__title', 'test__has_points', 'test__has_questions_explanation',
                  'test__has_right_answers', 'test__user_id']
        queryset = self.get_queryset()\
            .select_related('test', 'user', 'test__user')\
            .only(*fields)
        instance = get_object_or_404(queryset, pk=self.kwargs[self.lookup_field])
        self.check_object_permissions(self.request, instance)
        return instance

    def passages(self, request, *args, **kwargs):
        test_id = kwargs.get('pk')
        current_user = self.request.user
        fields = ['id', 'result']
        queryset = self.get_queryset()\
            .filter(
                test__id=test_id,
                user=current_user
            )\
            .only(*fields)
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True, fields=fields)
        return self.get_paginated_response(serializer.data)

    # def update_result(self, request, **kwargs):
    #     """Завершает прохождение теста, добавляя total результата"""
    #     result = self.get_object()
    #     total = get_total_data(result)
    #     serializer = self.get_saved_serializer({'total': total}, result, partial=True)
    #     return Response(serializer.data)

# class ChoicedAnswerAPIView(viewsets.GenericViewSet, APIViewMixin):
#     queryset = ChoicedAnswer.objects
#     serializer_class = ChoicedAnswerSerializer
#     permission_classes = (IsAuthenticated, IsUserAnswer)
#
#     def add_answer(self, request):
#         """Добавляет выбранный ответ при прохождении теста"""
#         serializer = self.get_saved_serializer(request.data)
#         choiced_answer = serializer.instance
#         update_result_passage(choiced_answer)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#
#     def update_answer(self, request, **kwargs):
#         """Изменяет выбранный ответ при прохождении теста"""
#         choiced_answer = self.get_object()
#         serializer = self.get_saved_serializer(request.data, choiced_answer, partial=True)
#         update_result_passage(choiced_answer)
#         return Response(serializer.data)
