from rest_framework import viewsets, mixins
from rest_framework.filters import SearchFilter, OrderingFilter

from catalog.serializers import CatalogSerializer
from tests.models import Test
from tests.paginations import TestPagination


class CatalogAPIView(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Test.objects.filter(is_published=True)
    serializer_class = CatalogSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['time_create']
    pagination_class = TestPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True, fields=('id', 'title', 'description', 'avatar'))
        return self.get_paginated_response(serializer.data)
