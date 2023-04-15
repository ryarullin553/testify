from rest_framework.generics import RetrieveUpdateAPIView
from .models import *
from .permissions import IsOwnerOrReadOnly
from .serializers import *


class MyUserAPIView(RetrieveUpdateAPIView):
    queryset = MyUser.objects.all()
    serializer_class = MyUserSerializer
    permission_classes = (IsOwnerOrReadOnly,)
