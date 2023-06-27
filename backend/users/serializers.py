from rest_framework import serializers

from utils.serializers import DynamicFieldsModelSerializer
from tests.models import Test
from tests.serializers import TestSerializer
from .models import User


class CustomUserSerializer(DynamicFieldsModelSerializer):
    created_tests = serializers.SerializerMethodField()
    finished_tests = serializers.SerializerMethodField()
    unfinished_tests = serializers.SerializerMethodField()

    def get_finished_tests(self, user):
        request = self.context['request']
        tests = Test.objects.filter(results__user=user, results__total__isnull=False).distinct()[0:3]
        serializer = TestSerializer(tests, many=True, read_only=True, fields=('id', 'title', 'avatar'),
                                    context={'request': request})
        return serializer.data

    def get_unfinished_tests(self, user):
        request = self.context['request']
        tests = Test.objects.filter(results__user=user, results__total__isnull=True).distinct()
        serializer = TestSerializer(tests, many=True, read_only=True, fields=('id', 'title', 'avatar'),
                                    context={'request': request})
        return serializer.data

    def get_created_tests(self, user):
        request = self.context['request']
        tests = user.created_tests.order_by('-created')[0:3]
        serializer = TestSerializer(tests, many=True, read_only=True, fields=('id', 'title', 'avatar'),
                                    context={'request': request})
        return serializer.data

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'bio', 'created_tests', 'unfinished_tests', 'finished_tests']
