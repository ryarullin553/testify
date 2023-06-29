from rest_framework import serializers

from utils.serializers import DynamicFieldsModelSerializer
from .models import Question


class QuestionSerializer(DynamicFieldsModelSerializer):

    class Meta:
        model = Question
        fields = '__all__'

    def validate(self, attrs):
        """Проверяет, что текущий пользователь является автором теста и может создавать к нему вопросы"""
        if self.context['request'].method == 'POST':
            test = attrs.get('test')
            user = self.context['request'].user
            if test.user != user:
                raise serializers.ValidationError('Текущий пользователь не является автором теста')
        return attrs

    def get_fields(self):
        """Запрещает изменение теста"""
        fields = super().get_fields()
        request = self.context.get('request')
        if request and request.method in ('PUT', 'PATCH'):
            fields['test'].read_only = True
        return fields

    # @staticmethod
    # def get_likes(question):
    #     likes = question.likes.filter(is_like=True).count()
    #     return likes
    #
    # @staticmethod
    # def get_dislikes(question):
    #     dislikes = question.likes.filter(is_like=False).count()
    #     return dislikes
    #
    # def check_like(self, question):
    #     user = self.context['request'].user
    #     likes = question.likes.filter(user=user)  # найти способ получать объект или None
    #     try:
    #         return likes[0].is_like
    #     except IndexError:
    #         return None
