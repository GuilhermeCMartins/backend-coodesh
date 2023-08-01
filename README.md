# Backend Coodesh

[![codecov](https://codecov.io/gh/GuilhermeCMartins/backend-coodesh/branch/master/graph/badge.svg)](https://codecov.io/gh/GuilhermeCMartins/backend-coodesh)

Test for Full-stack position at 'Marcenaria Diferente' by Coodesh

## Technologies Used

This project was built using the following technologies:

[![Node.js](https://img.shields.io/badge/Node.js-v14-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4-blue.svg)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v4-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-v2-blueviolet.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13-336791.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-latest-blue.svg)](https://www.docker.com/)

## Documentation

The API documentation for this backend is available using Swagger. You can access the Swagger documentation by visiting the following URL:

```
   http://localhost:4000/api-docs
```

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

List any prerequisites or software that needs to be installed before setting up the project. For example:

- Node.js and npm
- Docker (if using Docker for containerization)
- Postgres (if using a local database)

### Installing

1.  Clone the repository:

    ```
       git clone https://github.com/GuilhermeCMartins/backend-coodesh.git
       cd backend-coodesh
    ```

2.  Configuration:

    2.1 Configuration with Docker:

    If you are using Docker, you can run the application with:

    ```
       docker-compose up
    ```

    2.2 Configuration without Docker:

    2.2.1
    if you're using Postgres local, need to change on .env your connection string and

           ```
              DATABASE_URL="postgresql://user:password@host:port/namedb"
           ```

    2.2.2
    For the first time using, you need to run the following commmands to Prisma works

           ```
           npx prisma generate
           npx prisma migrate dev --name init
           ```

    2.2.3
    Run the application:

           ```
              npm start
           ```
