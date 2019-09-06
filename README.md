# BE-NC-NEWS

A RESTful API built using Express and Knex, serving up data from a PSQL database. This serves as the back end for my Northcoders News project, a Reddit-style news aggregation and discussion board, found here - <br/><br/>
Netlify: https://suspicious-brattain-e95481.netlify.com<br/>
Github: https://github.com/samuellea/fend-nc-news

## Getting Started

Fork and clone this project to your local machine, and once in the directory run `npm install`

### Prerequisites

The latest version of [Node.js](https://nodejs.org/).

## Running the tests

The spec folder of this project contains automated test-suites, for the app and for utils functions. Run these respectively using `npm test` and `npm test-utils`.

## Built with

- [Express](https://expressjs.com/)

- [Knex](http://knexjs.org/)

- [PostgreSQL](https://https://www.postgresql.org/)

## Author

- [Sam Lea](https://github.com/samuellea/)

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
