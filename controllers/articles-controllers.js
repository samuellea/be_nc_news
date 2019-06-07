const { selectAllArticles, selectArticleByID, updateArticleByID } = require("../models/articles-models.js");
const { selectUserByUsername } = require("../models/users-models.js")
const { selectTopicBySlug } = require("../models/topics-models.js")
const { generateArticlesErrMsg } = require('../utils/index.js')

exports.sendArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByID(article_id).then(([article]) => {
    if (!article) {
      return Promise.reject({
        status: 404,
        msg: `No article found with article_id ${article_id}`,
      });
    }
    res.status(200).send({ article });
  })
    .catch(next);
}

exports.sendAllArticles = (req, res, next) => {
  const { author, topic } = req.query;
  selectAllArticles(req.query)
    .then(articles => {
      if (!articles.length) {
        return Promise.all([author ? selectUserByUsername(author) : null, topic ? selectTopicBySlug(topic) : null])
      } else {
        res.status(200).send({ articles });
      }
    })
    .then(authorOrTopic => {
      let customArticlesMsg = generateArticlesErrMsg(authorOrTopic, author, topic);
      return Promise.reject({
        status: 404,
        msg: `No articles found - ${customArticlesMsg}`,
      });
    })
    .catch(next);
};

exports.sendUpdatedArticleByID = (req, res, next) => {
  console.log(req.body, '<--------')
  updateArticleByID(req.body, req.params).then(([article]) => {
    res.status(200).send({ article });
  })
    .catch(next);
}
