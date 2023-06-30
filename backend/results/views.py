from rest_framework import status, viewsets
from rest_framework.filters import OrderingFilter

from .models import Passage
from .permissions import PassagePermission
from .serializers import PassageSerializer


class PassageAPIView(viewsets.ModelViewSet):
    queryset = Passage.objects
    serializer_class = PassageSerializer
    permission_classes = [PassagePermission]
    filter_backends = [OrderingFilter]
    ordering = '-created'

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
