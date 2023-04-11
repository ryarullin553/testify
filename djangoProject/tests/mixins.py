

class APIViewMixin:

    @staticmethod
    def get_instance(pk, model):
        if not pk:
            raise Exception('Отсутствует id в запросе')
        try:
            instance = model.objects.get(pk=pk)
        except model.DoesNotExist:
            raise Exception('Данного id не существует')
        return instance

    @staticmethod
    def get_serializer(model_serializer, data, instance=None, partial=False):
        serializer = model_serializer(data=data, instance=instance, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer
