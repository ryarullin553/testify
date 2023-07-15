FROM python:3.11-alpine3.18

COPY . /app/backend/
WORKDIR /app/backend/

EXPOSE 8000

RUN apk add postgresql-client build-base postgresql-dev

RUN pip install --no-cache-dir -r requirements.txt