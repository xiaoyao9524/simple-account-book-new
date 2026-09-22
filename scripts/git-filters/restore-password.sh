#!/bin/bash
# smudge filter: checkout 时从本地 application-local.properties 还原真实密钥
# application-local.properties 被 .gitignore 忽略，不会进入版本控制

LOCAL_FILE="bill-server/src/main/resources/application-local.properties"

if [ -f "$LOCAL_FILE" ]; then
  REAL_PASSWORD=$(grep -E 'spring\.datasource\.password' "$LOCAL_FILE" | sed -E 's/.*=[[:space:]]*//' | tr -d '[:space:]')
  REAL_SALT=$(grep -E 'app\.password\.salt' "$LOCAL_FILE" | sed -E 's/.*=[[:space:]]*//' | tr -d '[:space:]')
  REAL_JWT=$(grep -E 'app\.jwt\.secret' "$LOCAL_FILE" | sed -E 's/.*=[[:space:]]*//' | tr -d '[:space:]')

  sed -E \
    -e "s/(spring\.datasource\.password[[:space:]]*=[[:space:]]*).*/\1${REAL_PASSWORD}/" \
    -e "s/(app\.password\.salt[[:space:]]*=[[:space:]]*).*/\1${REAL_SALT}/" \
    -e "s/(app\.jwt\.secret[[:space:]]*=[[:space:]]*).*/\1${REAL_JWT}/"
else
  cat
fi
