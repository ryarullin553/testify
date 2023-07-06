from rest_framework import serializers
from .models import Bookmark, Feedback, Comment, Like


class BookmarkSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    title = serializers.CharField(source='test.title', read_only=True)
    image = serializers.ImageField(source='test.image', read_only=True)

    class Meta:
        model = Bookmark
        fields = ['user', 'test', 'title', 'image']


class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    user_name = serializers.CharField(read_only=True)

    class Meta:
        model = Feedback
        fields = ['user', 'test', 'rate', 'content', 'user_id', 'user_name', 'created']
        extra_kwargs = {'test': {'write_only': True}}

    def update(self, instance, validated_data):
        if validated_data.get('test'):
            raise serializers.ValidationError('Тест не может быть изменен')
        return super().update(instance, validated_data)


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    user_name = serializers.CharField(read_only=True, source='user.username')
    user_avatar = serializers.ImageField(read_only=True, source='user.avatar')
    user_id = serializers.IntegerField(read_only=True, source='user.id')

    class Meta:
        model = Comment
        fields = ['id', 'user', 'question', 'user_id', 'user_name', 'user_avatar', 'created', 'content']
        extra_kwargs = {'question': {'write_only': True}}


class LikeSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    is_like = serializers.BooleanField(default=None)

    class Meta:
        model = Like
        fields = ['id', 'user', 'question', 'is_like']
        extra_kwargs = {'question': {'write_only': True}}
