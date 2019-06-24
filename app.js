const express = require('express');
const apiRouter = require('./routes/api-router');
const { routeNotFound, handle500, handleCustomErrors, handlePsqlErrors, handleServerErrors, } = require('./errors');
const cors = require('cors')

const app = express();

app.use(express.json());

app.use(cors())

app.use('/api', apiRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
