const connection = require('../db/connection.js')

exports.selectTopics = () => {
  return connection
    .select('*')
    .from('topics')
    .returning('*')
}

exports.selectTopicBySlug = slug => {
  return connection
    .select('*')
    .from('topics')
    .where({ slug })
    .returning('*')
}
