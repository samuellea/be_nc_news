const connection = require('../db/connection.js')

exports.selectUserByUsername = username => {
  return connection
    .select('*')
    .from('users')
    .where({ username })
    .returning('*')
}
