from rest_framework import serializers
from .models import Test, Question, Answer


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['content', 'is_true']


class QuestionSerializer(DynamicFieldsModelSerializer):
    answer_set = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'content', 'test', 'answer_set']

    def create(self, validated_data):
        """Создает вопрос и связанные с ним ответы"""
        answers_data = validated_data.pop('answer_set')
        question = Question.objects.create(**validated_data)
        for answer_data in answers_data:
            Answer.objects.create(question=question, **answer_data)
        return question

    def update(self, question, validated_data):
        """Обновляет вопрос, удаляет его старые ответы и создает новые"""
        answers_data = validated_data.pop('answer_set')
        question.answer_set.all().delete()
        setattr(question, *validated_data, validated_data['content'])
        for answer_data in answers_data:
            Answer.objects.create(question=question, **answer_data)
        return question


class TestSerializer(DynamicFieldsModelSerializer):
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())
    question_set = QuestionSerializer(required=False, many=True, fields=('id', 'content', 'answer_set'))

    class Meta:
        model = Test
        fields = ['id', 'title', 'description', 'full_description', 'avatar', 'author', 'is_published', 'question_set']
