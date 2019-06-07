exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: 'Route Not Found' });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};

exports.handleCustomErrors = (err, req, res, next) => {
  // console.log('reaching *** handleCustomErrors ***')
  // console.log(err);
  // console.log('------------------')
  if (err.status) res.status(err.status).send({ status: err.status, msg: err.msg });
  else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  // console.log('reaching *** handlePsqlErrors ***')
  // console.log(err);
  // console.log(err.message.split(' - ')[1]);
  // console.log('------------------')
  const psqlBadRequestCodes = ['22P02', '42703'];
  if (psqlBadRequestCodes.includes(err.code))
    res.status(400).send({ status: 400, msg: err.message.split(' - ')[1] || 'Bad Request' });
  else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};
