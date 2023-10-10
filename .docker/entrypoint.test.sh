#!/bin/bash

echo ".................................."
echo "TEST CONTAINER:"

cd home/node/app

npm install --legacy-peer-deps
npm run lint
npm run typeorm:run


if ! [ -z $TEST ] && [ $TEST == 'unit' ]; then
    echo "Running unit tests"
    npm run test:cov
elif ! [ -z $TEST ] && [ $TEST == 'e2e' ]; then
    echo "Running e2e tests"
    npm run test:e2e:cov
elif ! [ -z $TEST ] && [ $TEST == 'lint' ]; then
    echo "Running lint"
    npm run lint
    npm run format
else
    echo "Running test"
    npm run start:dev
fi
