from rest_framework import serializers
from .models import Result, ChoicedAnswer


class ChoicedAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChoicedAnswer
        fields = ['result', 'answer']

    def validate(self, attrs):
        result = attrs.get('result')
        answer = attrs.get('answer')
        if result.test != answer.question.test:
            raise serializers.ValidationError('Поля result, answer должны относится к одному тесту.')
        return attrs


class ResultSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Result
        fields = '__all__'
