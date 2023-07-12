from rest_framework import serializers
from .models import Feedback


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