const articlesRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const {
  sendAllArticles,
  sendArticleByID,
  sendUpdatedArticleByID,
  sendPostedComment,
  sendCommentsByArticleID
} = require('../controllers/articles-controllers.js');

articlesRouter
  .route('/')
  .get(sendAllArticles)
  .all(methodNotAllowed);

articlesRouter
  .route('/:article_id')
  .get(sendArticleByID)
  .patch(sendUpdatedArticleByID)
  .all(methodNotAllowed);

articlesRouter
  .route('/:article_id/comments')
  .get(sendCommentsByArticleID)
  .post(sendPostedComment)
  .all(methodNotAllowed);

module.exports = articlesRouter;
