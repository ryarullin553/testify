FROM node:20-alpine3.17 as build

COPY . /app/frontend/
WORKDIR /app/frontend/

EXPOSE 3000

RUN npm ci
RUN npm run build