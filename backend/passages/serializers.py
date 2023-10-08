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
    user_id = serializers.UUIDField(
        read_only=True
    )
    user_name = serializers.CharField(
        read_only=True
    )
    user_image = serializers.ImageField(
        read_only=True
    )
    test = serializers.PrimaryKeyRelatedField(
        queryset=Test.objects
        .filter(is_published=True)
        .only(
            'id', 'title', 'user_id', 'has_points',
            'has_questions_explanation', 'has_right_answers'
        )
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
            instance=passage.answers.only(
                'id', 'question_id', 'passage_id', 'content'
            ),
            many=True,
            read_only=True,
            fields=('id', 'question', 'content')
        )
        return serializer.data

    def create(self, validated_data):
        """
        Исключает создание прохождения, если есть незавершенное.
        """
        test = validated_data.get('test')
        user = validated_data.get('user')
        has_current_passage = Passage.objects.filter(
            test_id=test.id,
            user_id=user.id,
            result__isnull=True
        ).exists()
        if has_current_passage:
            raise serializers.ValidationError(
                {'detail': 'Имеется незавершенное прохождение.'}
            )
        return super().create(validated_data)
