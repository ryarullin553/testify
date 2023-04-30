from rest_framework.generics import RetrieveUpdateAPIView
from .models import User
from .permissions import IsOwnerOrReadOnly
from .serializers import UserSerializer


class UserAPIView(RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsOwnerOrReadOnly,)
