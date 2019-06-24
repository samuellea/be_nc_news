const { updateCommentByID, deleteCommentByID, selectCommentByID } = require('../models/comments-models.js');

exports.sendUpdatedCommentByID = (req, res, next) => { ////
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  selectCommentByID(comment_id).then(([comment]) => {
    if (Object.keys(req.body).length > 1) {
      return Promise.reject({
        status: 400,
        msg: `Invalid additional keys on the request object - please only provide inc_votes.`,
      });
    }
    if (!comment) return Promise.reject({ status: 404, msg: `No comment found with comment_id ${comment_id}` });
    updateCommentByID(inc_votes, comment_id).then(([comment]) => {
      res.status(200).send({ comment });
    }).catch(next);
  }).catch(next);
};

exports.removeCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentByID(comment_id).then(delCount => {
    if (delCount === 1) res.sendStatus(204);
    else if (delCount === 0) return Promise.reject({ status: 404, msg: `Cannot delete - no comment exists with comment_id ${comment_id}` });
  }).catch(next);
}