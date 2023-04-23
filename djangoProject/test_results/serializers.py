from rest_framework import serializers
from .models import Result, ChoicedAnswer


class ChoicedAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChoicedAnswer
        fields = '__all__'


class ResultSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Result
        fields = '__all__'
