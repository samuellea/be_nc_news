const connection = require('../db/connection.js')

exports.selectUserByID = () => {
  console.log('reaching selectTopics model...');
  return connection
    .select('*')
    .from('topics')
    .returning('*')
}
