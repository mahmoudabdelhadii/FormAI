#!/bin/bash

apt update
apt install jq


HCP_API_TOKEN=$(curl --location "https://auth.idp.hashicorp.com/oauth2/token" \
--header "Content-Type: application/x-www-form-urlencoded" \
--data-urlencode "client_id=$HCP_CLIENT_ID" \
--data-urlencode "client_secret=$HCP_CLIENT_SECRET" \
--data-urlencode "grant_type=client_credentials" \
--data-urlencode "audience=https://api.hashicorp.cloud" | jq -r .access_token)

curl \
--location "https://api.cloud.hashicorp.com/secrets/2023-06-13/organizations/a22046b0-3028-4806-a225-27e80e32d053/projects/ccc495ee-37be-4459-8e7d-3b338aaa1092/apps/FormAI-secrets/open" \
--request GET \
--header "Authorization: Bearer $HCP_API_TOKEN" | jq