const connection = require('../db/connection.js')

exports.selectArticleByID = article_id => {
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
    .modify((query) => {
      if (author) query.where({ 'articles.author': author });
      if (topic) query.where({ 'articles.topic': topic })
    })
    .orderBy(sort_by, order)
};

exports.updateArticleByID = (body, { article_id }) => {
  const { inc_votes } = body;
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: `A key of inc_votes is required on the request body!`,
    });
  }
  if (typeof inc_votes !== 'number') {
    return Promise.reject({
      status: 400,
      msg: `inc_votes of '${inc_votes}' is invalid - please provide an integer.`,
    });
  }
  let keys = Object.keys(body);
  if (keys.length !== 1 || keys[0] !== 'inc_votes') {
    return Promise.reject({
      status: 400,
      msg: `Invalid additional keys on the request object - please only provide inc_votes.`,
    });
  }
  return connection('articles')
    .where('article_id', '=', article_id)
    .update({
      'votes': connection.raw(`votes + ${inc_votes}`)
    })
    .returning('*')
}

exports.insertCommentByArticleID = ({ username, body }, { article_id }) => {
  return connection
    .insert({ 'author': username, body, article_id }) // able to insert comment before inserting user first (signing up)? user must exist first, surely?
    .into('comments')
    .returning('*');
}

exports.selectCommentsByArticleID = (article_id, { sort_by = 'created_at', order = 'desc' }) => {
  if (order !== 'asc' && order !== 'desc') {
    return Promise.reject({
      status: 400,
      msg: `Invalid order: ${order}`,
    });
  };
  return connection
    .select('*')
    .from('comments')
    .where('article_id', article_id)
    .orderBy(sort_by, order)
    .returning('*')
}
