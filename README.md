![](/docs/img/logo.svg) 
____
![](https://img.shields.io/badge/Python-3.11-254F72?style=flat-squar)
![](https://img.shields.io/badge/Django-4.2.3-0C4B33?style=flat-squar)
![](https://img.shields.io/badge/DRF-3.14-A30000?style=flat-squar)
![](https://img.shields.io/badge/PostgreSQL-15.1-2F6792?style=flat-squar)
![](https://img.shields.io/badge/Docker-24.0.2-2496ED?style=flat-squar)
![](https://img.shields.io/badge/Docker_Compose-2.19.1-92AAC8?style=flat-squar)
![](https://img.shields.io/badge/Celery-5.3.1-8FAC4A?style=flat-squar)
![](https://img.shields.io/badge/Redis-7.0-D9281A?style=flat-squar)
![](https://img.shields.io/badge/Gunicorn-21.2.0-489747?style=flat-squar)
![](https://img.shields.io/badge/JavaScript-1.8.5-yellow?style=flat-squar)
![](https://img.shields.io/badge/TypeScript-5.1.6-2D79C7?style=flat-squar)
![](https://img.shields.io/badge/React-18.1-2A2C2E?style=flat-squar)
![](https://img.shields.io/badge/Nginx-1.25.1-0E9748?style=flat-squar)

![](/docs/img/main.png)
___
- [Техническое задание на разработку](./docs/technical_requirements.md)
- [Локальный запуск](#title1)
- [Интерфейсы](#interface)
___

### <a id="title1">Локальный запуск</a>

- Установить [Docker](https://www.docker.com/) и Docker Compose
- Скачать проект
```bash
git clone https://github.com/ryarullin553/testify.git
```
- Перейти в директорию backend
```bash
cd backend
```
- Создать .env файл и прописать секреты
```bash
SECRET_KEY=
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
OPENAI_API_KEY=
DB_HOST=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
```
- Поднять docker-compose с созданием образов
```bash
docker-compose up --build
```
- При необходимости создать суперпользователя
```bash
docker-compose exec backend sh -c "python manage.py createsuperuser"
```
---
<a id="interface">![](/docs/img/catalog_page.png)</a>
![](/docs/img/create_question_page.png)
![](/docs/img/create_test_page.png)
![](/docs/img/profile_my_tests_page.png)