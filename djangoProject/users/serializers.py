from rest_framework import serializers

from django.db.models import Q
from tests.models import Test
from tests.serializers import TestSerializer, DynamicFieldsModelSerializer
from .models import User


class UserSerializer(DynamicFieldsModelSerializer):
    created_tests = TestSerializer(many=True, read_only=True, fields=('id', 'title', 'avatar'))
    finished_tests = serializers.SerializerMethodField()
    unfinished_tests = serializers.SerializerMethodField()

    @staticmethod
    def get_finished_tests(user):
        tests = Test.objects.filter(results__user=user, results__total__isnull=False).distinct()
        serializer = TestSerializer(tests, many=True, read_only=True, fields=('id', 'title', 'avatar'))
        return serializer.data

    @staticmethod
    def get_unfinished_tests(user):
        tests = Test.objects.filter(~Q(results__total__isnull=False), results__user=user).distinct()
        serializer = TestSerializer(tests, many=True, read_only=True, fields=('id', 'title', 'avatar'))
        return serializer.data

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'bio', 'created_tests', 'unfinished_tests', 'finished_tests']
