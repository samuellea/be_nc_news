const commentsRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const { sendUpdatedCommentByID, removeCommentByID } = require('../controllers/comments-controllers.js');

commentsRouter.route('/:comment_id')
  .patch(sendUpdatedCommentByID)
  .delete(removeCommentByID)
  .all(methodNotAllowed);

module.exports = commentsRouter;
