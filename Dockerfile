FROM node:14-alpine

RUN apk update && apk add git

WORKDIR /app
