from rest_framework import serializers
from .models import Bookmark


class BookmarkSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    title = serializers.CharField(source='test.title', read_only=True)
    image = serializers.ImageField(source='test.image', read_only=True)

    class Meta:
        model = Bookmark
        fields = ['user', 'test', 'title', 'image']
