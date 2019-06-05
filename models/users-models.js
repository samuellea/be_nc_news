const connection = require('../db/connection.js')

exports.selectUserByID = username => {
  console.log('reaching selectUserByID model...');
  return connection
    .select('*')
    .from('users')
    .where({ username })
    .returning('*')
}
