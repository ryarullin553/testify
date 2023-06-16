from rest_framework import serializers

from utils.serializers import DynamicFieldsModelSerializer
from .models import Result, ChoicedAnswer


class ChoicedAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChoicedAnswer
        fields = ['id', 'result', 'answer']

    def validate(self, attrs):
        """Проверяет корректность полей выбранного ответа и завершенность теста"""
        result = attrs.get('result')
        answer = attrs.get('answer')
        if result.test != answer.question.test:
            raise serializers.ValidationError('Поля result, answer должны относится к одному тесту.')
        if result.total:
            raise serializers.ValidationError('Тест уже завершен.')
        return attrs

    def update(self, instance, validated_data):
        """Проверяет отношение поле answer к вопросу при изменении выбранного ответа"""
        question = instance.answer.question
        answers = question.answer_set.all()
        user_answer = validated_data['answer']
        if user_answer not in answers:
            raise serializers.ValidationError({'non_field_errors': ['Поле answer должно относится к текущему вопросу.']})
        return super().update(instance, validated_data)


class ResultSerializer(DynamicFieldsModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Result
        fields = ['id', 'test', 'user', 'passage', 'total']

    def update(self, instance, validated_data):
        """Проверяет завершенность теста, чтобы исключить изменение результата"""
        if instance.total:
            raise serializers.ValidationError({'error': 'Тест уже завершен.'})
        return super().update(instance, validated_data)
