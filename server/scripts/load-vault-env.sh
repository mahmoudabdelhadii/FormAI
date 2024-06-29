#!/bin/bash


set -e
 SECRETS_MANAGER="aws secretsmanager"
 REGION="ap-southeast-1"
 
 function get_secret {
    $($SECRETS_MANAGER get-secret-value --secret-id $secret --query SecretString --output text --region $REGION)
 }
 
 function parse_secret {
    jq -r 'to_entries[] | "export \(.key)='\''\(.value)'\''"'
 }
 
 read -r -a secrets <<< "$SECRETS"
    for secret in "${secrets[@]}"
 do
    export_vars=$(get_secret | parse_secret)
    eval $export_vars
 done
 exec "$@"