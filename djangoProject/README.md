## Установка

1. Установить python 3.9
2. Перейти в директорию djangoProject
```bash
cd djangoProject
```
3. Создать виртуальное окружение
```bash
py -m venv venv
```
4. Активировать виртуальное окружение
```bash
source venv/Scripts/activate
```
5. Установить зависимости
```bash
pip install -r requirements.txt
```

6. Где-то взять файл `settings.py` и положить его в корень проекта

## Локальный запуск
1. Активировать виртуальное окружение

```bash
source venv/Scripts/activate
```
2. Перейти в директорию djangoProject
```bash
cd djangoProject
```

3. Запустить тестовый сервер
```bash
py manage.py runserver
```
