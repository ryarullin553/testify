from rest_framework import serializers
from .models import *


class TestAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestAnswer
        fields = ('id', 'content', 'is_true')


class TestQuestionSerializer(serializers.ModelSerializer):
    testanswer_set = TestAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = TestQuestion
        fields = ('id', 'content', 'testanswer_set')


class TestSerializer(serializers.ModelSerializer):
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())
    is_published = serializers.HiddenField(default=True)
    testquestion_set = TestQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Test
        fields = '__all__'


class CatalogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ('title', 'description', 'full_description', 'avatar', 'author')


class TestResultSerializer(serializers.ModelSerializer):
    correct_answers = serializers.HiddenField(default=0)
    total_questions = serializers.HiddenField(default=0)
    score = serializers.HiddenField(default=0)

    class Meta:
        model = TestResult
        fields = ('correct_answers', 'total_questions', 'score')


class TestResultAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestResultAnswer
        fields = '__all__'


class TestResultSummarySerializer(serializers.Serializer):
    total_questions = serializers.IntegerField()
    correct_answers = serializers.IntegerField()
    percent_correct = serializers.FloatField()
