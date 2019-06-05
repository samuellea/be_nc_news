const usersRouter = require('express').Router();

const { sendUserByID } = require("../controllers/users-controllers.js");

usersRouter.route('/:username')
  .get(sendUserByID);

module.exports = usersRouter;
