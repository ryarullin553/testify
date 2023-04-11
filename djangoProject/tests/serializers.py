from rest_framework import serializers
from .models import *


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ('pk', 'title', 'description', 'full_description', 'avatar', 'author', 'is_published')


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('pk', 'content', 'test')


class TestAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ('content', 'question', 'is_true')
