#!/bin/sh

echo "---------------Run migrations---------------"

node /app/migrations.js

echo "---------------Run migrations - END---------"

postgres -c 'config_file=/app/postgresql.conf'  -p 5001

node /app/main.js
