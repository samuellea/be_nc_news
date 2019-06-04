const { articlesData, commentsData, topicsData, usersData } = require('../data');
const { formatTimestamp } = require('../../utils');

exports.seed = (knex, Promise) => {
  console.log('Seeding...')
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex('topics')
        .insert(topicsData)
        .returning('*')
    })
    .then(topicsRows => {
      console.log(topicsRows);
      return knex('users')
        .insert(usersData)
        .returning('*')
    })
    .then(usersRows => {
      console.log(usersRows);
      // we need some timestamp formatting logic here.
      formatTimestamp(articlesData)

      return knex('articles')
        .insert(articlesData)
        .returning('*')
    })
    .then(articlesRows => {
      console.log(articlesRows);
      // we need some timestamp formatting logic here too.
      return knex('comments')
        .insert(commentsData)
        .returning('*')
    })
};

// topics --> users --> articles --> comments
