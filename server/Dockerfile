# Use a specific version of node alpine for the development environment
FROM node:alpine as development

# Set the working directory in the container
WORKDIR /usr/src/server

# Pass build arguments and set them as environment variables
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

ARG REFRESH_SECRET
ENV REFRESH_SECRET=${REFRESH_SECRET}

ARG SECRET
ENV SECRET=${SECRET}

ARG CRYPTO_KEY=none
ENV CRYPTO_KEY=${CRYPTO_KEY}

ARG NODE_PORT=8080
ENV NODE_PORT=${NODE_PORT}

ARG EMAIL
ENV EMAIL=${EMAIL}

ARG PASSWORD
ENV PASSWORD=${PASSWORD}

ARG EMAIL_SERVICE
ENV EMAIL_SERVICE=${EMAIL_SERVICE}

ARG CLOUDFRONT_DOMAIN
ENV CLOUDFRONT_DOMAIN=${CLOUDFRONT_DOMAIN}

ARG CLOUDFRONT_KEY_PAIR_ID
ENV CLOUDFRONT_KEY_PAIR_ID=${CLOUDFRONT_KEY_PAIR_ID}

ARG CLOUDFRONT_PRIVATE_KEY
ENV CLOUDFRONT_PRIVATE_KEY=${CLOUDFRONT_PRIVATE_KEY}

ARG SENTRY_DSN
ENV SENTRY_DSN=${SENTRY_DSN}

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package*.json ./

# Install all Node.js dependencies
RUN npm install

# Copy the Prisma schema file
COPY prisma ./prisma/

# Copy all other project files to the container
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the project
RUN npm run build

# Use the same node alpine version for the production environment
FROM node:alpine as production

# Set NODE_ENV to production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

ARG REFRESH_SECRET
ENV REFRESH_SECRET=${REFRESH_SECRET}

ARG SECRET
ENV SECRET=${SECRET}

ARG CRYPTO_KEY
ENV CRYPTO_KEY=${CRYPTO_KEY}

ARG EMAIL
ENV EMAIL=${EMAIL}

ARG PASSWORD
ENV PASSWORD=${PASSWORD}

ARG EMAIL_SERVICE
ENV EMAIL_SERVICE=${EMAIL_SERVICE}

ARG CLOUDFRONT_DOMAIN
ENV CLOUDFRONT_DOMAIN=${CLOUDFRONT_DOMAIN}

ARG CLOUDFRONT_KEY_PAIR_ID
ENV CLOUDFRONT_KEY_PAIR_ID=${CLOUDFRONT_KEY_PAIR_ID}

ARG CLOUDFRONT_PRIVATE_KEY
ENV CLOUDFRONT_PRIVATE_KEY=${CLOUDFRONT_PRIVATE_KEY}

ARG SENTRY_DSN
ENV SENTRY_DSN=${SENTRY_DSN}

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

# Set the working directory in the container
WORKDIR /usr/src/server

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the built distributable JavaScript from the development stage
COPY --from=development /usr/src/server/dist ./dist

# Copy the Prisma directory
COPY --from=development /usr/src/server/prisma ./prisma

# Copy the generated Prisma client
COPY --from=development /usr/src/server/node_modules/@prisma/client /usr/src/server/node_modules/@prisma/client
COPY --from=development /usr/src/server/node_modules/.prisma /usr/src/server/node_modules/.prisma
COPY --from=development /usr/src/server/src/generated/client /usr/src/server/src/generated/client

# Copy the swagger.yml file
COPY --from=development /usr/src/server/src/swagger.yml ./

# Expose the port the app runs on
EXPOSE 8080

# Command to run the app
CMD ["node", "dist/index.js"]
