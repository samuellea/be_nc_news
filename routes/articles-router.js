const articlesRouter = require('express').Router();

const { sendAllArticles, sendArticleByID } = require("../controllers/articles-controllers.js");

articlesRouter.route('/')
  .get(sendAllArticles);

articlesRouter.route('/:article_id')
  .get(sendArticleByID)

module.exports = articlesRouter;
