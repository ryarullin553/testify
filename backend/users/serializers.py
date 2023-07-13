from djoser.conf import settings
from djoser.compat import get_user_email_field_name, get_user_email
from rest_framework import serializers

from .models import User


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'image', 'info', 'created']

    def update(self, instance, validated_data):
        email_field = get_user_email_field_name(User)
        if settings.SEND_ACTIVATION_EMAIL and email_field in validated_data:
            instance_email = get_user_email(instance)
            if instance_email != validated_data[email_field]:
                instance.is_active = False
                instance.save(update_fields=["is_active"])
        return super().update(instance, validated_data)


    # def get_finished_tests(self, user):
    #     request = self.context['request']
    #     tests = Test.objects.filter(results__user=user, results__total__isnull=False).distinct()[0:3]
    #     serializer = TestSerializer(tests, many=True, read_only=True, fields=('id', 'title', 'avatar'),
    #                                 context={'request': request})
    #     return serializer.data
    #
    # def get_unfinished_tests(self, user):
    #     request = self.context['request']
    #     tests = Test.objects.filter(results__user=user, results__total__isnull=True).distinct()
    #     serializer = TestSerializer(tests, many=True, read_only=True, fields=('id', 'title', 'avatar'),
    #                                 context={'request': request})
    #     return serializer.data
    #
    # def get_created_tests(self, user):
    #     request = self.context['request']
    #     tests = user.created_tests.order_by('-created')[0:3]
    #     serializer = TestSerializer(tests, many=True, read_only=True, fields=('id', 'title', 'avatar'),
    #                                 context={'request': request})
    #     return serializer.data


