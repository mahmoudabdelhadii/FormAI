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
ENV DATABASE_URL

ARG REFRESH_SECRET
ENV REFRESH_SECRET

ARG SECRET
ENV SECRET

ARG CRYPTO_KEY=none
ENV CRYPTO_KEY

WORKDIR usr/src/server

COPY package*.json .

RUN npm ci --only=production

COPY --from=development usr/src/server/dist ./dist

RUN npm run prisma:gen

EXPOSE 8080

COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
