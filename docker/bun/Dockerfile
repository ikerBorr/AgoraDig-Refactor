FROM oven/bun:1

ENV PATH="/root/.bun/bin:${PATH}"

WORKDIR /usr/src/app

COPY package.json bun.lock ./

RUN bun install --ci

COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]