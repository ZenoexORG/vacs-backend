<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Vehicle Access Control System (VACS) Backend

Backend service built with NestJS for VACS - a system designed to manage and control vehicle access in secured areas.

## Description

This service provides REST API endpoints to manage vehicle access records, schedules, and related security data.

## Documentation

Detailed documentation can be found in the [docs](./docs) directory.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://{host}:3000/docs
```

Replace `{host}` with your server's hostname or IP address.

## Environment Variables

Make sure to set up the following environment variables:

```
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_SSL=true
PORT=3000
```

## License

This project is [MIT licensed](LICENSE).
