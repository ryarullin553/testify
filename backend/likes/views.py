from rest_framework import viewsets, status
from rest_framework.response import Response

from utils.permissions import UserRelationPermission
from .models import Like


class LikeAPIView(viewsets.GenericViewSet):
    queryset = Like.objects
    permission_classes = [UserRelationPermission]

    def create(self, request, *args, **kwargs):
        """
        Система лайков

        Поставить лайк вопросу:
        {
            is_like: true,
            question_id: <question_id>
        }

        Поставить дизлайк вопросу:
        {
            is_like: false,
            question_id: <question_id>
        }

        Убрать лайк или дизлайк у вопроса:
        {
            is_like: null,
            question_id: <question_id>
        }

        Поставить лайк комментарию:
        {
            is_like: true,
            comment_id: <comment_id>
        }

        Поставить дизлайк комментарию:
        {
            is_like: false,
            comment_id: <comment_id>
        }

        Убрать лайк или дизлайк у комментария:
        {
            is_like: null,
            comment_id: <comment_id>
        }
        """
        data = request.data
        is_like = data.pop('is_like')
        if 'question_id' not in data.keys() \
                and 'comment_id' not in data.keys() or len(data.keys()) != 1:
            raise TypeError('Некорректный json в теле запроса')
        obj, _ = self.queryset.get_or_create(
            **data, user_id=self.request.user.id
        )
        if is_like is None:
            obj.delete()
        else:
            obj.is_like = is_like
            obj.save()
        return Response(status=status.HTTP_201_CREATED)
