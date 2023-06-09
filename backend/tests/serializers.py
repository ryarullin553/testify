from django.contrib.auth.models import AnonymousUser
from rest_framework import serializers

from results.models import Result
from user_relations.models import Bookmark
from .models import Test, Question, Answer


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
        likes = question.likes.filter(user=user)   # найти способ получать объект или None
        try:
            return likes[0].is_like
        except IndexError:
            return None


class TestSerializer(DynamicFieldsModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    question_set = QuestionSerializer(required=False, many=True, fields=('id', 'content', 'answer_set'))
    rating = serializers.DecimalField(max_digits=2, decimal_places=1, read_only=True)
    feedbacks_count = serializers.IntegerField(read_only=True)
    results_count = serializers.IntegerField(read_only=True)
    in_bookmarks = serializers.SerializerMethodField(method_name='check_bookmark')
    user_name = serializers.CharField(read_only=True, source='user.username')
    user_avatar = serializers.ImageField(read_only=True, source='user.avatar')
    user_bio = serializers.CharField(read_only=True, source='user.bio')
    is_passage = serializers.SerializerMethodField(method_name='check_passage')

    class Meta:
        model = Test
        fields = ['id', 'title', 'description', 'avatar', 'user', 'is_published', 'question_set', 'rating',
                  'feedbacks_count', 'results_count', 'in_bookmarks', 'full_description', 'user_name',
                  'user_avatar', 'user_bio', 'is_passage']

    def check_bookmark(self, test):
        user = self.context['request'].user
        if isinstance(user, AnonymousUser):
            return False
        bookmark = Bookmark.objects.filter(test=test, user=user)
        return bookmark.exists()

    def check_passage(self, test):
        user = self.context['request'].user
        if isinstance(user, AnonymousUser):
            return False
        result = Result.objects.filter(test=test, user=user, total__isnull=True)
        return result.exists()
