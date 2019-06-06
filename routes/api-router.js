const apiRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const topicsRouter = require('./topics-router.js');
const usersRouter = require('./users-router.js');
const articlesRouter = require('./articles-router.js');


apiRouter
  .route('/')
  .get((req, res) => res.send({ ok: true }))
  .all(methodNotAllowed);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;
