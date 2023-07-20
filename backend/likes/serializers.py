from rest_framework import serializers
from .models import Like


class LikeSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Like
        exclude = ['created', 'updated']
        extra_kwargs = {
            'question': {
                'required': False,
                'default': None
            },
            'comment': {
                'required': False,
                'default': None
            }
        }
