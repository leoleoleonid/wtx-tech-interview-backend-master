# wtx backend tech challenge

## Table of Content
- [Setup](#setup)
- [Running the app](#running-the-app)
  - [npm](#npm)
  - [docker](#docker)
- [Seeds](#seeds)
- [Tests](#tests)
  - [Unit Tests](#unit-tests)
  - [E2E Tests](#e2e-tests)
  - [Test Coverage](#test-coverage)
# Setup
```bash
# copy .env file from .env.example
$ cp .env.example .env
```

# Running the app
You can run the app directly locally through [npm](#npm) or using [docker](#docker).

## npm
```bash
# install dependencies
$ npm install
```

```bash
# watch mode
$ npm run start:dev
```

```bash
# production mode
$ npm run start:prod
```

## Docker
```bash
# watch and detached mode + rebuild if npm changes (requires to have node_modules installed locally)
$ docker-compose up -d --build -V

# build production image and run prod version locally
$docker-compose -f docker-compose.prod.yml up --build
```

# Seeds

In order to facilitate the project development there are seeds already developed for both [Trucks](src/__old/truck/truck.entity.ts) and [TruckScores](src/__old/truck-score/truck-score.entity.ts) entities.

```bash
# run the seeds in order to populate the database
$ npm run seed:run
```
# Tests
This app contains unit and e2e tests. In order to run them follow the steps below:

## Unit tests
```bash
# run unit tests
$ npm run test
```

## E2E tests

```bash
# run e2e tests
$ npm run test:e2e
```


## Test coverage
```bash
# run test coverage
$ npm run test:cov
```

