# GAMER'S GUIDE - API

## About This Project

This is an API for a game review app which allows users to publish and retrieve revies to and from a database.

You can find a hosted verson of the app at:

> HOSTED URL

---

### Getting Started

To clone this repository use the following CLI command:

`git clone URL`

The project **requires** the following **dependencies**:

- pg-format
- dotenv
- express
- pg
- husky
- jest
- supertest

To **install** these **dependencies** run the folowing CLI command:

`npm install`

In order to run the app you will need to **setup development and test PSQL databases**, to do so please create a .env file for each database (.env.test & .env.development).

Both .env files will need to contain the following line:

`PGDATABASE=<database_name_here>`

There is an example .env file in the root directory and you can find the pre-set database names inside the setup.sql file in the db directory.

---

### Running Tests

The test suite is broken down into utility tests and intergration tests.

To run all test suites use:

`npm test`

---

### Minimum Versions

- Node JS: v18.5.0

- PostgreSQL: 14.4

---

### Contact

If you have any questions about the project please feel free to reach out, you can contact me via email at github@lprice.dev
