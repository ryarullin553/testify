from rest_framework import serializers
from .models import Bookmark, Feedback, Comment, LikeDislike


class BookmarkSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    title = serializers.CharField(source='test.title', read_only=True)
    avatar = serializers.ImageField(source='test.avatar', read_only=True)

    class Meta:
        model = Bookmark
        fields = ['user', 'test', 'title', 'avatar']


class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = Feedback
        fields = ['user', 'test', 'rate', 'content', 'user_id', 'user_name', 'created']
        extra_kwargs = {'test': {'write_only': True}}


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    user_name = serializers.CharField(read_only=True, source='user.username')
    user_avatar = serializers.ImageField(read_only=True, source='user.avatar')
    user_id = serializers.IntegerField(read_only=True, source='user.id')

    class Meta:
        model = Comment
        fields = ['id', 'user', 'question', 'user_id', 'user_name', 'user_avatar', 'created', 'content']
        extra_kwargs = {'question': {'write_only': True}}


class LikeDislikeSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = LikeDislike
        fields = ['id', 'user', 'question', 'is_like']
