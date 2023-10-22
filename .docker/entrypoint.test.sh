#!/bin/bash

echo ".................................."
echo "TEST CONTAINER:"

cd home/node/app

npm install --legacy-peer-deps
npm run lint
npm run typeorm:run


if ! [ -z $TEST ] && [ $TEST == 'test' ]; then
    echo "Running unit tests"
    npm run test

    echo "Running E2E tests"
    npm run test:e2e
else
    echo "Running test"
    npm run start:dev
fi
