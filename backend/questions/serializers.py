from rest_framework import serializers

from .models import Answer, Question


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'content', 'is_true']


class QuestionSerializer(DynamicFieldsModelSerializer):
    answer_set = AnswerSerializer(many=True)
    likes = serializers.SerializerMethodField()
    dislikes = serializers.SerializerMethodField()
    is_like = serializers.SerializerMethodField(method_name='check_like')

    class Meta:
        model = Question
        fields = ['id', 'content', 'test', 'answer_set', 'likes', 'dislikes', 'is_like']

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
        question.save()
        return question

    @staticmethod
    def get_likes(question):
        likes = question.likes.filter(is_like=True).count()
        return likes

    @staticmethod
    def get_dislikes(question):
        dislikes = question.likes.filter(is_like=False).count()
        return dislikes

    def check_like(self, question):
        user = self.context['request'].user
        likes = question.likes.filter(user=user)  # найти способ получать объект или None
        try:
            return likes[0].is_like
        except IndexError:
            return None
