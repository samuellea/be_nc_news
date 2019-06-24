// here is where, based on which env we're running, the conditional
// logic for deciding which set of data is used by the seed file occurs.
const ENV = process.env.NODE_ENV || 'development';

const development = require('./dev-data');
const test = require('./test-data');

const data = {
  development,
  test,
  production: development
};

module.exports = data[ENV];
