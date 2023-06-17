from django.core.management.base import BaseCommand
from django.apps import apps
from django.core import management
import os

from users.models import User


class Command(BaseCommand):

    def handle(self, *args, **options):
        os.system('dropdb testify_db')
        self.delete_migrations()
        os.system('createdb -O testify_user testify_db')
        management.call_command('makemigrations')
        management.call_command('migrate')
        self.create_admin()

    @staticmethod
    def delete_migrations():
        migration_packs = [f"{app.path}\migrations" for app in apps.get_app_configs() if '\\venv\\' not in app.path]
        for migration_pack in migration_packs:
            for dirpath, dirnames, filenames in os.walk(migration_pack):
                for filename in filenames:
                    if filename.endswith('.py') and not filename.startswith('__init__'):
                        file_path = os.path.join(dirpath, filename)
                        os.remove(file_path)

    @staticmethod
    def create_admin():
        username = 'admin'
        email = 'admin@mail.ru'
        password = '123'
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f"Логин: {email}. Пароль: {password}")