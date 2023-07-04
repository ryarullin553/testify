from rest_framework import viewsets, mixins
from rest_framework.filters import OrderingFilter
from rest_framework.generics import get_object_or_404

from .models import Passage
from .permissions import PassagePermission
from .serializers import PassageSerializer
from .services import get_result


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
        fields = ['id', 'test', 'result', 'user_id',
                  'test__title', 'test__has_points', 'test__has_questions_explanation',
                  'test__has_right_answers', 'test__user_id']
        queryset = self.get_queryset()\
            .select_related('test')\
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

    def perform_update(self, serializer):
        serializer.save(result=get_result(self.get_object()))


    # def update_result(self, request, **kwargs):
    #     """Завершает прохождение теста, добавляя total результата"""
    #     result = self.get_object()
    #     total = get_total_data(result)
    #     serializer = self.get_saved_serializer({'total': total}, result, partial=True)
    #     return Response(serializer.data)

