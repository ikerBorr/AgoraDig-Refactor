# Imagen e con Node 20 (Alpine)
FROM node:20-alpine

RUN apk add --no-cache curl bash
RUN curl -fsSL https://bun.sh/install | bash

ENV PATH="/root/.bun/bin:${PATH}"

WORKDIR /usr/src/app

COPY package*.json ./

RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]