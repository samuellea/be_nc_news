const commentsRouter = require('express').Router();

const { sendUpdatedCommentByID } = require('../controllers/comments-controllers.js');

commentsRouter.route('/:comment_id')
  .patch(sendUpdatedCommentByID);

module.exports = commentsRouter;
