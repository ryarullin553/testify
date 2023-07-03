from rest_framework import serializers

from tests.models import Test
from utils.serializers import DynamicFieldsModelSerializer
from tests.serializers import TestSerializer
from .models import Passage


class PassageSerializer(DynamicFieldsModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    test_data = serializers.SerializerMethodField(read_only=True)
    test = serializers.PrimaryKeyRelatedField(
        queryset=Test.objects
        .filter(is_published=True)
        .only('id', 'title', 'user_id', 'has_points', 'has_questions_explanation', 'has_right_answers')
    )

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

    def update(self, instance, validated_data):
        """Проверяет завершенность теста, чтобы исключить изменение результата. Исключает изменение теста"""
        if validated_data.get('test'):
            raise serializers.ValidationError({'detail': 'Тест уже завершен'})
        if instance.result:
            raise serializers.ValidationError({'detail': 'Тест уже завершен'})
        return super().update(instance, validated_data)
