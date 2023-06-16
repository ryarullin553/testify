from django.contrib.auth.models import AnonymousUser
from rest_framework import serializers

from utils.serializers import DynamicFieldsModelSerializer
from questions.serializers import QuestionSerializer
from results.models import Result
from user_relations.models import Bookmark
from .models import Test


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
