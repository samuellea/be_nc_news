const connection = require('../db/connection.js')

exports.selectTopics = () => {
  // console.log('reaching selectTopics model...');
  return connection
    .select('*')
    .from('topics')
    .returning('*')
}
