from rest_framework import serializers

from utils.serializers import DynamicFieldsModelSerializer
from questions.serializers import QuestionSerializer
from .models import Test


class TestSerializer(DynamicFieldsModelSerializer):
    questions = serializers.SerializerMethodField()
    rating = serializers.DecimalField(
        max_digits=2,
        decimal_places=1,
        read_only=True
    )
    feedbacks_count = serializers.IntegerField(
        read_only=True
    )
    results_count = serializers.IntegerField(
        read_only=True
    )
    user_name = serializers.CharField(
        read_only=True,
        source='user.username'
    )
    user_avatar = serializers.ImageField(
        read_only=True,
        source='user.avatar'
    )
    user_bio = serializers.CharField(
        read_only=True,
        source='user.bio'
    )
    in_bookmarks = serializers.BooleanField(
        read_only=True
    )
    has_passage = serializers.BooleanField(
        read_only=True
    )

    def get_questions(self, test):
        fields = ['id', 'type', 'content', 'answer_choices', 'image']
        if test.has_points:
            fields.append('points')
        if test.has_questions_explanation:
            fields.append('explanation')
        questions = test.questions.all()
        serializer = QuestionSerializer(
            instance=questions,
            many=True,
            read_only=True,
            fields=fields
        )
        return serializer.data

    class Meta:
        model = Test
        fields = '__all__'

