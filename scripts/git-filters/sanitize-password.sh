#!/bin/bash
# clean filter: git add 时自动将密码、盐、JWT密钥替换为占位符
# 只影响暂存区（index），不修改本地工作区文件
sed -E \
  -e 's/(spring\.datasource\.password[[:space:]]*=[[:space:]]*).*/\1YOUR_PASSWORD_HERE/' \
  -e 's/(app\.password\.salt[[:space:]]*=[[:space:]]*).*/\1YOUR_SALT_HERE/' \
  -e 's/(app\.jwt\.secret[[:space:]]*=[[:space:]]*).*/\1YOUR_JWT_SECRET_HERE/'
