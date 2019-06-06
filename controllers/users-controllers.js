const { selectUserByUsername } = require("../models/users-models.js");

exports.sendUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username).then(([user]) => {
    if (!user) {
      return Promise.reject({
        status: 404,
        msg: `No user found for username: ${username}`,
      });
    } else {
      res.status(200).send({ user })
    };
  }).catch(next);
};