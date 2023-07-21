FROM python:3.11.4-slim

COPY . /app/gpt/
WORKDIR /app/gpt/

EXPOSE 8501

RUN apt-get update && apt-get -y install libpq-dev gcc
RUN pip install -r requirements.txt