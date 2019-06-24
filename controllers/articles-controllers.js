const { selectAllArticles, selectArticleByID, updateArticleByID, insertCommentByArticleID, selectCommentsByArticleID } = require("../models/articles-models.js");
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
  updateArticleByID(req.body, req.params).then(([article]) => {
    res.status(200).send({ article });
  })
    .catch(next);
}

exports.sendPostedComment = (req, res, next) => {
  insertCommentByArticleID(req.body, req.params).then(([comment]) => {
    res.status(201).send({ comment });
  })
    .catch(next);
}

exports.sendCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleID(article_id, req.query).then(comments => {
    if (!comments.length) {
      return selectArticleByID(article_id);
    } else {
      res.status(200).send({ comments })
    }
  })
    .then(articleSearchResult => {
      if (articleSearchResult.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article with article_id ${article_id} doesn't exist.`,
        });
      } else {
        res.status(200).send({ comments: [] })
      }
    })
    .catch(next);
}


