const { articlesData, commentsData, topicsData, usersData } = require('../data');
const { formatTimestamp, formatComments } = require('../../utils');

exports.seed = (knex, Promise) => {
  console.log('Seeding...')
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => { // failing here
      return knex('topics')
        .insert(topicsData)
        .returning('*')
    })
    .then(() => {
      return knex('users')
        .insert(usersData)
        .returning('*')
    })
    .then(() => {
      let articlesWithFormattedTime = formatTimestamp(articlesData);
      return knex('articles')
        .insert(articlesWithFormattedTime)
        .returning('*')
    })
    .then(articles => {
      let formattedComments = formatComments(commentsData, articles);
      return knex('comments')
        .insert(formattedComments)
        .returning('*')
    })
};

// topics --> users --> articles --> comments
