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

echo "INFO: Starting the application..."
NODE_ENV=production NODE_PORT=8080 node dist/index.js
