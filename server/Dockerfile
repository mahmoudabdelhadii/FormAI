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

WORKDIR usr/src/server

COPY package*.json .

RUN npm ci --only=production

COPY --from=development usr/src/server/dist ./dist

RUN npm run prisma:gen

CMD ["node","dist/index.js"]