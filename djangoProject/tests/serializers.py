from rest_framework import serializers
from .models import *


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ('title', 'description', 'full_description', 'avatar', 'author')


class TestQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestQuestion
        fields = ('content', 'test')


class TestAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestAnswer
        fields = ('content', 'question', 'is_true')
