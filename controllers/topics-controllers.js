const { selectTopics } = require("../models/topics-models.js");

exports.sendTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  }).catch();
};