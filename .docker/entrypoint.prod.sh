#!/bin/sh

// TODO rodar migrations

postgres -c 'config_file=/app/postgresql.conf'  -p 5001

node /app/main.js
