# Use a specific version of node alpine for the development environment
FROM node:21-alpine as development

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

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package*.json ./

# Install all Node.js dependencies
RUN npm install

# Copy the Prisma schema file
COPY prisma ./prisma/

# Copy all other project files to the container
COPY . .

# Generate Prisma client
RUN npm run prisma:gen

# Build the project
RUN npm run build

# Use the same node alpine version for the production environment
FROM node:21-alpine as production

# Set NODE_ENV to production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Repeat the process of setting environment variables
ENV DATABASE_URL=${DATABASE_URL}
ENV REFRESH_SECRET=${REFRESH_SECRET}
ENV SECRET=${SECRET}
ENV CRYPTO_KEY=${CRYPTO_KEY}

ENTRYPOINT echo $DATABASE_URL
# Set the working directory in the container
WORKDIR /usr/src/server

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the built distributable JavaScript from the development stage
COPY --from=development /usr/src/server/dist ./dist

# Copy the Prisma directory and binaries
COPY --from=development /usr/src/server/prisma ./prisma

COPY --from=development /usr/src/server/node_modules/@prisma/client /usr/src/server/node_modules/@prisma/client
COPY --from=development /usr/src/server/node_modules/.prisma /usr/src/server/node_modules/.prisma
# Copy the entrypoint script
COPY --from=development /usr/src/server/docker-entrypoint.sh ./docker-entrypoint.sh

# Expose the port the app runs on
EXPOSE 8080

# Set the entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]

# Command to run the app
CMD ["node", "dist/index.js"]
