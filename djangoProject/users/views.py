from rest_framework import mixins, viewsets
from rest_framework.response import Response

from .models import User
from .permissions import IsOwnerOrReadOnly
from .serializers import UserSerializer


class UserAPIView(mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def retrieve(self, request, *args, **kwargs):
        """Возвращает профиль пользователя"""
        user = self.get_object()
        fields = ['username', 'avatar', 'bio', 'finished_tests']
        if user == request.user:
            serializer = self.get_serializer(user, fields=fields + ['unfinished_tests'])
        else:
            serializer = self.get_serializer(user, fields=fields + ['created_tests'])
        return Response(serializer.data)

