#!/bin/bash

cd /home/node/app
npm install --legacy-peer-deps
echo "---------------Run migrations---------------"
npm run typeorm:run
echo "---------------Run migrations - END---------"
npm run start:dev
