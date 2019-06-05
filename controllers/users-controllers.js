const { selectUserByID } = require("../models/users-models.js");

exports.sendUserByID = (req, res, next) => {
  console.log('reaching sendUserByID controller...');
  const { username } = req.params;
  selectUserByID(username).then(([user]) => {
    if (!user) {
      return Promise.reject({
        status: 404,
        message: `No user found for username: ${username}`,
      });
    } else {
      res.status(200).send({ user })
    };
  }).catch(next);
};