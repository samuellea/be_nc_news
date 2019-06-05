const { selectTopics } = require("../models/topics-models.js");

exports.sendTopics = (req, res, next) => {
  // console.log('reaching sendTopics controller...');
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  }).catch();
}


// exports.sendHouses = (req, res, next) => {
//   selectHouses(req.query).then((houses) => {
//     res.status(200).send({ houses });
//   });
// };