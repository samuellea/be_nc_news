const connection = require('../db/connection.js')

exports.selectAllArticles = ({ sort_by = 'created_at', order = 'desc', author, topic }) => {
  if (order !== 'asc' && order !== 'desc') { //// this seems clunky... handle invalid order here like this?
    return Promise.reject({   /// Izzy seemed to think maybe its okay if it just defaults to desc and doesnt return error
      status: 400,
      msg: `Invalid order: ${order}`,
    });
  };
  return connection
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

exports.selectArticleByID = () => {
  console.log('reaching selectArticleByID model')
};
