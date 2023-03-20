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

## Task description

As a senior engineer, we need you to pair program with a junior engineer to refactor the code in a way that it becomes:
- **clean and readable** - self describing

Now all business logic contains in src/domain/ and src/usecases/ folders.
Business logic doesn't depend on our infrastructure.
Each use-case method describes itself inside its code.

- **testable** - we're not confident making changes to this code. How can we add tests ?

Because we don't depend on our infrastructure, it's easy now to write unit tests for business logic. Infrastructure components are implemented with dependency injection too, so it's easy to mock them for tests.

- **reusable** - are there any opportunities of code reuse ?

Can be easily used for other infrastructure. For example, we can easily add cli command to a controller or use message brokers instead of http or switch from one db to another. all we need to do is to implement an interface.

- **configurable** - what can we leverage from spliting configuration from code ?

standard ConfigModule

- **extendable** - we can easily add/remove factors to the scoring logic

see  src/domain/model/truck.ts

- **observable** - currently it's hard to track and troubleshoot if something goes wrong

Swagger, Exceptions filter and service and Logger were added



TODO
- create endpoint to receive average price updates
external service must send update message with avg prices, then scores must be updated. otherwise scores can be unsync
- fix response formats to support old responses formats

