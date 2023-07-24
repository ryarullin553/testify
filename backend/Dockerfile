FROM python:3.11.4-slim

COPY . /app/backend/
WORKDIR /app/backend/

EXPOSE 8000

RUN apt-get update && apt-get -y install libpq-dev gcc
RUN pip install -r requirements.txt

COPY ./server-entrypoint.sh /server-entrypoint.sh
RUN chmod +x /server-entrypoint.sh
ENTRYPOINT ["/server-entrypoint.sh"]