from django.db.models import Avg
from django.db.models.functions import Round

from tests.models import Test
from tests.serializers import DynamicFieldsModelSerializer
from user_relations.serializers import FeedbackSerializer
from users.serializers import UserSerializer


class CatalogSerializer(DynamicFieldsModelSerializer):
    feedback_set = FeedbackSerializer(required=False, many=True)
    user = UserSerializer()

    class Meta:
        model = Test
        fields = ['id', 'title', 'description', 'full_description', 'avatar', 'user', 'feedback_set']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        feedbacks = instance.feedback_set
        representation.update(feedbacks.aggregate(rating=Round(Avg('rate'), 1)))
        representation['feedbacks'] = feedbacks.count()
        representation['results'] = instance.result_set.count()
        return representation
