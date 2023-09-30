from rest_framework import serializers

from utils.serializers import DynamicFieldsModelSerializer
from .models import Question


class QuestionSerializer(DynamicFieldsModelSerializer):
    has_like = serializers.BooleanField(read_only=True)

    class Meta:
        model = Question
        exclude = ['created', 'updated']
        read_only_fields = ['likes_count', 'dislikes_count']

    def validate(self, attrs):
        """
        Проверяет, что текущий пользователь является автором теста и может
        создавать к нему вопросы
        """
        if self.context['request'].method == 'POST':
            test = attrs.get('test')
            current_user = self.context['request'].user
            if test.user_id != current_user.id:
                raise serializers.ValidationError(
                    'Текущий пользователь не является автором теста'
                )
        return attrs

    def get_fields(self):
        """Запрещает изменение теста"""
        fields = super().get_fields()
        request = self.context.get('request')
        if request and request.method in ('PUT', 'PATCH'):
            fields['test'].read_only = True
        return fields
