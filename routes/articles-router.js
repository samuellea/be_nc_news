const articlesRouter = require('express').Router();

const { sendAllArticles, sendArticleByID, sendUpdatedArticleByID, sendPostedComment, sendCommentsByArticleID } = require("../controllers/articles-controllers.js");

articlesRouter.route('/')
  .get(sendAllArticles);

articlesRouter.route('/:article_id')
  .get(sendArticleByID)
  .patch(sendUpdatedArticleByID)

articlesRouter.route('/:article_id/comments')
  .post(sendPostedComment)
  .get(sendCommentsByArticleID)

module.exports = articlesRouter;
