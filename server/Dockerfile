FROM node:21-alpine as development

WORKDIR usr/src/server

COPY package*.json .

RUN npm install

COPY prisma ./prisma/

COPY . .

RUN npm run prisma:gen

RUN npm run build

FROM node:21-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV={$NODE_ENV}

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

ARG REFRESH_SECRET
ENV REFRESH_SECRET=${REFRESH_SECRET}

ARG SECRET
ENV SECRET=${SECRET}

ARG CRYPTO_KEY=none
ENV CRYPTO_KEY=${CRYPTO_KEY}

WORKDIR usr/src/server

COPY package*.json .

RUN npm ci --only=production

COPY --from=development usr/src/server/dist ./dist


COPY --from=development usr/src/server/docker-entrypoint.sh ./docker-entrypoint.sh

RUN npm run prisma:gen

EXPOSE 8080

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["node","dist/index.js"]