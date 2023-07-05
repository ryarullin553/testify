from rest_framework import serializers

from answers.serializers import AnswerSerializer
from tests.models import Test
from utils.serializers import DynamicFieldsModelSerializer
from tests.serializers import TestSerializer
from .models import Passage


class PassageSerializer(DynamicFieldsModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    test = serializers.PrimaryKeyRelatedField(
        queryset=Test.objects
        .filter(is_published=True)
        .only('id', 'title', 'user_id', 'has_points', 'has_questions_explanation', 'has_right_answers')
    )
    test_data = serializers.SerializerMethodField()
    answers = serializers.SerializerMethodField()

    class Meta:
        model = Passage
        exclude = ['created', 'updated']

    def get_test_data(self, passage):
        test = passage.test
        test.__dict__['is_finished_passage'] = bool(passage.result)
        serializer = TestSerializer(
            instance=test,
            read_only=True,
            required=False,
            fields=('title', 'questions'),
            context={'request': self.context['request']}
        )
        return serializer.data

    @staticmethod
    def get_answers(passage):
        serializer = AnswerSerializer(
            instance=passage.answers.only('id', 'question_id', 'passage_id', 'content'),
            many=True,
            read_only=True,
            fields=('id', 'question', 'content')
        )
        return serializer.data
