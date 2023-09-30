from django.db import models
from django.db.models import Count, F, Q, Sum


class PassageManager(models.Manager):
    def create_result(self):
        fields = ['id', 'result', 'created', 'user_id', 'test_id',
                  'test__id', 'test__has_points']
        return self \
            .select_related('test') \
            .annotate(
                questions_count=Count(
                    expression='test__questions',
                    distinct=True
                ),
                answers_count=Count(
                    expression='answers',
                    distinct=True
                ),
                correct_answers_count=Count(
                    expression='answers',
                    filter=Q(
                        answers__content=F('test__questions__right_answers')
                    ),
                    distinct=True
                ),
                total_points=Sum(
                    'test__questions__points',
                    distinct=True
                ),
                user_points=Sum(
                    'test__questions__points',
                    filter=Q(
                        answers__content=F('test__questions__right_answers')
                    ),
                    distinct=True
                )
            ) \
            .only(*fields)

    def finished(self, test_id):
        fields = ['id', 'user_id', 'result', 'codeword']
        return self \
            .filter(
                test__id=test_id,
                result__isnull=False
            ) \
            .annotate(
                user_name=F('user__username')
            ) \
            .only(*fields)

    def user_test(self, test_id, user_id):
        fields = ['id', 'result']
        return self \
            .filter(
                test__id=test_id,
                user_id=user_id
            ) \
            .only(*fields)

    def with_base_fields(self):
        fields = ['id', 'test', 'result', 'user_id', 'codeword',
                  'test__title', 'test__has_points',
                  'test__has_questions_explanation',
                  'test__has_right_answers', 'test__user_id']
        return self \
            .select_related('test') \
            .only(*fields)
