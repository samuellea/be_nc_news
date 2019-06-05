const express = require('express');
const apiRouter = require('./routes/api-router');
const { routeNotFound, handle500 } = require('./errors');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  const psqlCodes = [];
  console.log(err)
  if (err.status) res.status(err.status).send({ message: err.message });
  if (psqlCodes.includes(err.code)) res.status(400).send({ message: err.message || 'Bad Request' });
  else res.status(500).send({ message: 'Internal Server Error' });
});

module.exports = app;
