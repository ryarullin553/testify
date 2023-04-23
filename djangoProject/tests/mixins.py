from django.shortcuts import get_object_or_404


class APIViewMixin:

    def get_instance(self, pk, model):
        if not pk:
            raise Exception('Отсутствует id в запросе')
        instance = get_object_or_404(model, pk=pk)
        self.check_object_permissions(self.request, instance)
        return instance

    @staticmethod
    def serialize_data(model_serializer, data, instance=None, partial=False):
        serializer = model_serializer(data=data, instance=instance, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer
