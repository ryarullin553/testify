from rest_framework import serializers
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_avatar = serializers.ImageField(source='user.avatar', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'question', 'comment', 'user_id', 'user_name', 'user_avatar', 'created', 'content']
        extra_kwargs = {
            'question': {'write_only': True},
            'comment': {'write_only': True}
        }
