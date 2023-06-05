## Установка

1. Установить [Python 3.11](https://www.python.org/) 

2. Клонировать репозиторий
```bash
git clone https://github.com/ryarullin553/testify.git
```

3. Перейти в backend
```bash
cd backend
```

4. Создать виртуальное окружение
```bash
python -m venv venv
```
5. Активировать виртуальное окружение
```bash
.\venv\Scripts\activate
```
В терминале должен появиться префикс:

`(venv) PS C:\..\testify\backend> `

6. Установить зависимости
```bash
pip install -r requirements.txt
```

7. Добавить переменную окружения `.env`

## Подключение базы данных

1. Установить [PostgreSQL 15.1](https://www.postgresql.org/)

2. Войти в SQL Shell
```bash
psql postgres postgres
```

3. Создать пользователя базы данных
```postgresql
CREATE USER testify_user
```

4. Создать базу данных
```postgresql
CREATE DATABASE testify_db WITH OWNER testify_user
```

5. Выйти из SQL Shell
```postgresql
/q
```

6. Создать миграции
```bash
python manage.py makemigrations
```

7. Провести миграции
```bash
python manage.py migrate
```

## Локальный запуск
1. Перейти в директорию backend
```bash
cd backend
```

2. Активировать виртуальное окружение при необходимости
```bash
.\venv\Scripts\activate
```
В терминале должен появиться префикс: 

`(venv) PS C:\..\testify\backend> `

3. Запустить сервер
```bash
python manage.py runserver
```

