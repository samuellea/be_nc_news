const usersRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const { sendUserByUsername } = require("../controllers/users-controllers.js");

usersRouter.route('/:username')
  .get(sendUserByUsername)
  .all(methodNotAllowed);

module.exports = usersRouter;
