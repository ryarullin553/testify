from rest_framework import mixins, viewsets
from rest_framework.decorators import action
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
        fields = ['username', 'avatar', 'bio', 'finished_tests', 'created_tests']
        serializer = self.get_serializer(user, fields=fields)
        return Response(serializer.data)

    @action(detail=False, url_path='me', url_name='me')
    def get_current_user_profile(self, request):
        """Возвращает профиль текущего пользователя"""
        fields = ['username', 'avatar', 'bio', 'finished_tests', 'unfinished_tests']
        serializer = self.get_serializer(request.user, fields=fields)
        return Response(serializer.data)


