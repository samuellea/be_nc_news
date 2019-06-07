const commentsRouter = require('express').Router();

const { sendUpdatedCommentByID, removeCommentByID } = require('../controllers/comments-controllers.js');

commentsRouter.route('/:comment_id')
  .patch(sendUpdatedCommentByID)
  .delete(removeCommentByID)

module.exports = commentsRouter;
