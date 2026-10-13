FROM oven/bun:1 AS build

WORKDIR /app

COPY package.json ./
COPY bun.lock* package-lock.json* ./

RUN bun install

COPY . .
RUN bun run build

FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8089

COPY --from=build /app/.output ./.output

EXPOSE 8089

CMD ["node", ".output/server/index.mjs"]
