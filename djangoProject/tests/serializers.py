from rest_framework import serializers
from .models import *


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ('content', 'question', 'is_true')


class QuestionSerializer(serializers.ModelSerializer):
    answer_set = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'content', 'test', 'answer_set')


class TestSerializer(serializers.ModelSerializer):
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Test
        fields = ('id', 'title', 'description', 'full_description', 'avatar', 'author', 'is_published', 'time_create')
