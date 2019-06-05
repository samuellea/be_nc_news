const { articlesData, commentsData, topicsData, usersData } = require('../data');
const { formatTimestamp, formatComments } = require('../../utils');

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
      let articlesWithFormattedTime = formatTimestamp(articlesData);
      return knex('articles')
        .insert(articlesWithFormattedTime)
        .returning('*')
    })
    .then(articlesRows => {
      // we need some timestamp formatting logic here too.
      // let commentsWithFormattedTime = formatTimestamp(commentsData);

      // we ALSO need to do some other reformatting of our comment objects.
      // NAMELY, we need to reformat the belongs_to in the comments data to be article_id, as specified by our schema, using a reference object.
      // AND change the 'created_by' key name to 'author'.
      let formattedComments = formatComments(comments);
      return knex('comments')
        .insert(formattedComments)
        .returning('*')
    })
};

// topics --> users --> articles --> comments
