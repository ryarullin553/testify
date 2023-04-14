from rest_framework import mixins
from rest_framework.generics import UpdateAPIView, RetrieveUpdateAPIView
from rest_framework.viewsets import GenericViewSet
from .models import *
from .permissions import IsOwnerOrReadOnly
from .serializers import *


class MyUserAPIView(RetrieveUpdateAPIView):
    queryset = MyUser.objects.all()
    serializer_class = MyUserSerializer
    permission_classes = (IsOwnerOrReadOnly,)
