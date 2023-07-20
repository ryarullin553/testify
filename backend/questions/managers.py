from django.db import models


class QuestionManager(models.Manager):
    def create_copy(self, instance):
        return self \
            .create(
                test_id=instance.test_id,
                type=instance.type,
                content=instance.content,
                answer_choices=instance.answer_choices,
                right_answers=instance.right_answers,
                points=instance.points,
                explanation=instance.explanation,
                image=instance.image
            )
