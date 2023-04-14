from rest_framework import serializers
from .models import *


class MyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ('username', 'avatar', 'bio')
