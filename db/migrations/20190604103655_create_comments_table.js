
exports.up = function (knex, Promise) {
  // console.log('creating comments table...');
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary();
    commentsTable.string('author').references('users.username').notNullable(); // reference object -> created_by
    commentsTable.integer('article_id').references('articles.article_id').notNullable(); // reference object -> belongs_to
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.timestamp('created_at').defaultTo(knex.fn.now());
    commentsTable.text('body').notNullable();
  });
};

exports.down = function (knex, Promise) {
  // console.log('dropping comments table...');
  return knex.schema.dropTable('comments');
};
