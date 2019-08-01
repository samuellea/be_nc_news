# BE-NC-NEWS

A RESTful API built using Express and Knex, serving up data from a PSQL database. This serves as the back end for my Northcoders News project, a Reddit-style news aggregation board, found here - <br/><br/>
Netlify: [INSERT LINK HERE]<br/>
Github: https://github.com/samuellea/fend-nc-news

## Getting Started

Fork and clone this project to your local machine, and run _npm install_.

### Prerequisites

The latest version of Node.js

## Running the tests

The spec folder of this project contain automated test-suites, for the app for utils functions. Run these using _npm test_ and _npm test-utils_ respectively.

## Built with

- [Express][1]
  [1]: https://expressjs.com/ "Express"

- [Knex][2]
  [2]: http://knexjs.org/ "Knex"

- [PostgreSQL][3]
  [3]: https://https://www.postgresql.org/ "PostgreSQL"

## Author

- [Sam Lea][1]
  [1]: https://github.com/samuellea/ "Sam Lea"

## Available Scripts

Create development and test databases locally:

```bash
npm run setup-dbs
```

Create a new migration file:

```bash
npm run migrate-make <filename>
```

Run all migrations:

```bash
npm run migrate-latest
```

Rollback all migrations:

```bash
npm run migrate-rollback
```

Run tests:

```bash
npm test
```

Rollback, migrate -> latest, then start inserting data into the database:

```bash
npm run seed
```

Run the server with `nodemon`, for hot reload:

```bash
npm run dev
```

Run the server with `node`:

```bash
npm start
```
