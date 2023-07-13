from django.db.models import Count, Q, Exists, OuterRef
from rest_framework import serializers

from likes.models import Like
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
    user_image = serializers.ImageField(
        read_only=True,
        source='user.image'
    )
    user_info = serializers.CharField(
        read_only=True,
        source='user.info'
    )
    in_bookmarks = serializers.BooleanField(
        read_only=True
    )
    has_passage = serializers.BooleanField(
        read_only=True
    )

    def get_questions(self, test):
        request = self.context.get('request')
        current_user = request.user
        fields = ['id', 'type', 'content', 'answer_choices', 'image']
        if test.has_points:
            fields.append('points')
        if test.has_questions_explanation and (current_user.id == test.user_id or test.is_finished_passage):
            fields.append('explanation')
        if current_user.id == test.user_id or (test.has_right_answers and test.is_finished_passage):
            fields.append('right_answers')

        questions = test.questions\
            .annotate(
                likes_count=Count('likes', filter=Q(likes__is_like=True)),
                dislikes_count=Count('likes', filter=Q(likes__is_like=False)),
                has_like=Exists(
                    Like.objects.filter(
                        user_id=current_user.id,
                        question_id=OuterRef('pk')
                    )
                )
            )\
            .only(*fields, 'test_id')\
            .order_by('id')

        if current_user.id != test.user_id:
            fields += ['likes_count', 'dislikes_count', 'has_like']

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
