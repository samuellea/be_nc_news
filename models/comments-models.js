const connection = require('../db/connection.js')

exports.updateCommentByID = (inc_votes = 0, comment_id) => { ///
  if (typeof inc_votes !== 'number') {
    return Promise.reject({
      status: 400,
      msg: `inc_votes of '${inc_votes}' is invalid - please provide an integer.`,
    });
  }
  return connection('comments')
    .where('comment_id', '=', comment_id)
    .update({
      'votes': connection.raw(`votes + ${inc_votes}`) ///// CHANGE THIS - no .raw! Injection security risk! SEE similar func for articles.
    })
    .returning('*')
}

exports.deleteCommentByID = comment_id => {
  return connection('comments')
    .where('comment_id', '=', comment_id)
    .del();
}

exports.selectCommentByID = comment_id => {
  return connection
    .select('*')
    .from('comments')
    .where('comment_id', '=', comment_id)
    .returning('*');
}