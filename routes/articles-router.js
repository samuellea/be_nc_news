const articlesRouter = require('express').Router();

const { sendAllArticles, sendArticleByID, sendUpdatedArticleByID } = require("../controllers/articles-controllers.js");

articlesRouter.route('/')
  .get(sendAllArticles);

articlesRouter.route('/:article_id')
  .get(sendArticleByID)
  .patch(sendUpdatedArticleByID)

module.exports = articlesRouter;
