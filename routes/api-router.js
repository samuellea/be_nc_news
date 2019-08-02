const apiRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const topicsRouter = require('./topics-router.js');
const usersRouter = require('./users-router.js');
const articlesRouter = require('./articles-router.js');
const commentsRouter = require('./comments-router.js');
const endpointInfo = require('../endpointInfo.json');

apiRouter
  .route('/')
  .get((req, res) => res.send(endpointInfo))
  .all(methodNotAllowed);

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;