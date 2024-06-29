#!/bin/bash

SECRETS_ENV_LOADER_DEFAULT="./scripts/load-vault-env.sh"
# Source environment files from HashiCorp Vault

if [ -f "$SECRETS_ENV_LOADER_DEFAULT" ]; then
    echo "INFO: sourcing secret environment variables from  $SECRETS_ENV_LOADER_DEFAULT"
    source $SECRETS_ENV_LOADER_DEFAULT
else
    echo "WARNING: No secret environment variables loader script found at $SECRETS_ENV_LOADER_DEFAULT"
    echo "INFO: skipping sourcing of secret envs."
fi

# Make sure the DATABASE_URL environment variable is set
if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is not set. Exiting..."
  exit 1
fi

# Print the DATABASE_URL for debugging purposes (remove this in production)
echo "Using DATABASE_URL: $DATABASE_URL"

# Any other setup or initialization tasks can go here

exec "$@"


echo "INFO: Starting the application..."
NODE_ENV=production NODE_PORT=8080 node dist/index.js
