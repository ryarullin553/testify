from django.shortcuts import get_object_or_404


class APIViewMixin:

    def get_model_object(self, model, pk):
        """Возвращает экземпляр переданной модели по pk"""
        instance = get_object_or_404(model, pk=pk)
        self.check_object_permissions(self.request, instance)
        return instance

    def get_default_saved_serializer(self, data, instance=None, partial=False):
        """Возвращает сохраненный сериализатор, который определен в serializer_class APIView"""
        serializer = self.get_serializer(data=data, instance=instance, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer
