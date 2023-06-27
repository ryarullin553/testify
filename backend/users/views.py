from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import User
from .permissions import IsOwnerOrReadOnly
from .serializers import CustomUserSerializer


class UserAPIView(viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
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

    @get_current_user_profile.mapping.patch
    def update_profile(self, request, *args, **kwargs):
        instance = request.user
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


