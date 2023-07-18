FROM python:3.11.4-slim

COPY . /app/backend/
WORKDIR /app/backend/

EXPOSE 8000

RUN apt-get update && apt-get -y install libpq-dev gcc
RUN pip install -r requirements.txt
