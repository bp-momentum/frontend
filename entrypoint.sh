#!/bin/sh
set -e

./env.sh

cp ./env-config.js /var/www/localhost/htdocs/

lighttpd -D -f /etc/lighttpd/lighttpd.conf