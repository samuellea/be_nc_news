const { updateCommentByID } = require('../models/comments-models.js');

exports.sendUpdatedCommentByID = (req, res, next) => {

  updateCommentByID(req.body, req.params).then(([comment]) => {
    res.status(200).send({ comment });
  }).catch(next);
};