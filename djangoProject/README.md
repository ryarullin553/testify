## Установка

1. Установить python 3.11 с сайта https://www.python.org/
2. Перейти в директорию djangoProject
```bash
cd djangoProject
```

3. Создать виртуальное окружение
```bash
python -m venv venv
```
4. Активировать виртуальное окружение
```bash
.\venv\Scripts\activate
```
В терминале должен появиться префикс (venv)

Пример: (venv) PS B:\MyProjects\testify\djangoProject> 

5. Установить зависимости
```bash
pip install -r requirements.txt
```

6. Добавить файл `.env` в корень проекта

## Локальный запуск
1. Перейти в директорию djangoProject

```bash
cd djangoProject
```
2. Активировать виртуальное окружение, если оно неактивно
```bash
.\venv\Scripts\activate
```
В терминале должен появиться префикс (venv) 

3. Провести миграции в базу данных 
```bash
python manage.py migrate
```
Убедитесь, что в корне проекта появился файл db.sqlite3

3. Запустить тестовый сервер
```bash
python manage.py runserver
```