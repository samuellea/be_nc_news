const { updateCommentByID, deleteCommentByID } = require('../models/comments-models.js');

exports.sendUpdatedCommentByID = (req, res, next) => {
  updateCommentByID(req.body, req.params).then(([comment]) => {
    res.status(200).send({ comment });
  }).catch(next);
};

exports.removeCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentByID(comment_id).then(delCount => {
    if (delCount === 1) res.sendStatus(204);
    else if (delCount === 0) return Promise.reject({ status: 404, msg: `Cannot delete - no comment exists with comment_id ${comment_id}` });
  }).catch(next);
}