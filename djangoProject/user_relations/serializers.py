from rest_framework import serializers
from tests.serializers import TestSerializer
from .models import Bookmark, Feedback, Comment, LikeDislike


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


class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Feedback
        fields = ['id', 'user', 'test', 'content', 'rate']


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Comment
        fields = ['id', 'user', 'question', 'content', 'time_create']


class LikeDislikeSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = LikeDislike
        fields = ['id', 'user', 'question', 'is_like']
