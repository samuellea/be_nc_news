const topicsRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const { sendTopics } = require("../controllers/topics-controllers.js");

topicsRouter.route('/')
  .get(sendTopics)
  .all(methodNotAllowed);


module.exports = topicsRouter;
