from rest_framework import serializers

from answers.models import Answer
from passages.models import Passage
from questions.models import Question
from utils.serializers import DynamicFieldsModelSerializer


class AnswerSerializer(DynamicFieldsModelSerializer):
    question = serializers.PrimaryKeyRelatedField(
        queryset=Question.objects.all().only('id', 'test_id')
    )
    passage = serializers.PrimaryKeyRelatedField(
        queryset=Passage.objects
        .only('id', 'test_id', 'user_id', 'result')
    )

    class Meta:
        model = Answer
        exclude = ['created', 'updated']

    def validate(self, attrs):
        passage = attrs.get('passage')
        question = attrs.get('question')
        if passage and question:
            self.validate_test_relation(passage, question)
        if passage:
            self.validate_passage_user(passage, self.context['request'])
            self.validate_passage_result(passage)
        return attrs

    def update(self, instance, validated_data):
        """Исключает изменение прохождения или вопроса"""
        if validated_data.get('passage') or validated_data.get('question'):
            raise serializers.ValidationError({'detail': 'Можно изменять только содержание ответа'})
        return super().update(instance, validated_data)

    @staticmethod
    def validate_test_relation(passage, question):
        """Проверяет, что прохождение и вопрос относятся к одному тесту"""
        if passage.test_id != question.test_id:
            raise serializers.ValidationError({'detail': 'Прохождение и вопрос должны относиться к одному тесту'})

    @staticmethod
    def validate_passage_user(passage, request):
        """Проверяет, что текущий пользователь является инициатором прохождения и может создавать к нему ответы"""
        if request.method == 'POST' and passage.user_id != request.user.id:
            raise serializers.ValidationError({'detail': 'Текущий пользователь не является инициатором прохождения'})

    @staticmethod
    def validate_passage_result(passage):
        """Проверяет, что прохождение уже имеет результат"""
        if passage.result:
            raise serializers.ValidationError({'detail': 'Прохождение уже завершено'})
