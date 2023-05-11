from rest_framework import serializers
from tests.serializers import TestSerializer
from .models import Bookmark


class BookmarkSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Bookmark
        fields = ['id', 'user', 'test']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        test_data = TestSerializer(instance.test, fields=('id', 'title', 'avatar')).data
        representation['test'] = test_data
        return representation
