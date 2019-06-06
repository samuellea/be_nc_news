const { selectAllArticles, selectArticleByID } = require("../models/articles-models.js");
const { selectUserByUsername } = require("../models/users-models.js")
const { selectTopicBySlug } = require("../models/topics-models.js")
const { generateArticlesErrMsg } = require('../utils/index.js')

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

exports.sendArticleByID = (req, res, next) => {
  selectArticleByID().then(article => {
    res.status(200).send({ article });
  })
  console.log('reaching sendArticleByID controller')
}

