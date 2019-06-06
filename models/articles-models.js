const connection = require('../db/connection.js')

exports.selectArticleByID = article_id => {
  console.log('reaching selectArticleByID model')
  return connection
    .select('articles.*')
    .count('comment_id AS comment_count')
    .from('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .where('articles.article_id', article_id)
    .groupBy('articles.article_id');
};

exports.selectAllArticles = ({ sort_by = 'created_at', order = 'desc', author, topic }) => {
  if (order !== 'asc' && order !== 'desc') {
    return Promise.reject({
      status: 400,
      msg: `Invalid order: ${order}`,
    });
  };
  return connection // can't duplicate knex query from selectArticleByID here, as /api/articles shouldn't return a body according to readme.
    .select('articles.author', 'articles.title', 'articles.article_id', 'articles.topic', 'articles.created_at', 'articles.votes')
    .count('comment_id AS comment_count')
    .from('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .groupBy('articles.article_id')
    // ---- but will need the below... ---- //
    .modify((query) => {
      if (author) query.where({ 'articles.author': author });
      if (topic) query.where({ 'articles.topic': topic })
    })
    .orderBy(sort_by, order)
};

