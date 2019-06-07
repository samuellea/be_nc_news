const connection = require('../db/connection.js')

exports.updateCommentByID = (body, { comment_id }) => {
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
  return connection('comments')
    .where('comment_id', '=', comment_id)
    .update({
      'votes': connection.raw(`votes + ${inc_votes}`)
    })
    .returning('*')
}

exports.deleteCommentByID = comment_id => {
  return connection('comments')
    .where('comment_id', '=', comment_id)
    .del();
}