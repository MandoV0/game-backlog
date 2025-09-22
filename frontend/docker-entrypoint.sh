#!/bin/sh
set -e

# If API_BASE is provided, render nginx config from template. Else keep default.
if [ -n "$API_BASE" ]; then
  envsubst '$API_BASE' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
fi

exec "$@"


