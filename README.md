# Backend Coodesh

[![codecov](https://codecov.io/gh/GuilhermeCMartins/backend-coodesh/branch/master/graph/badge.svg)](https://codecov.io/gh/GuilhermeCMartins/backend-coodesh)

Test for Full-stack position at 'Marcenaria Diferente' by Coodesh

## Technologies Used

This project was built using the following technologies:

[![Node.js](https://img.shields.io/badge/Node.js-v14-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4-blue.svg)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v4-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-v2-blueviolet.svg)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-v8-blue.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-latest-blue.svg)](https://www.docker.com/)

## Description

This project involves creating a web interface to enable customers to upload transaction files for product sales. The platform follows a creator-affiliate model, where creators can sell products, and affiliates earn commissions. The main task is to normalize and store the data in a relational database. The 'sales.txt' file will be used for testing, adhering to the format provided in the 'Input File Format' section.

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
- MySQL (if using a local database)

### Installing

1. Clone the repository:

   ```
      git clone https://github.com/GuilhermeCMartins/backend-coodesh.git
      cd backend-coodesh
   ```

2. Install dependencies:

   ```
      npm install
   ```

3. Configuration:
   if you're using MySql, just need to change on .env your connection string

   ```
      datasource db {
         provider = "mysql"
         url = env("DATABASE_URL")
      }
   ```

4. Database Setup:
   for the first time using, you need to run the first migration

   ```
    npx prisma migrate dev --name init
   ```

5. Run the application:

   ```
      npm start
   ```

If you are using Docker, you can run the application with:

```
   docker-compose up
```
