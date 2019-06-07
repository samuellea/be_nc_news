process.env.NODE_ENV = 'test';
const app = require('../app');
const connection = require('../db/connection');

const _ = require('lodash');
const request = require('supertest');
const chai = require('chai')
chai.use(require('chai-sorted'));
const { expect } = chai;

describe('/', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe('/api', () => {
    it('GET status:200', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });

    describe('/topics', () => {
      describe('GET', () => {
        it('GET status:200 responds with an array of all topics', () => {
          return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
              expect(body.topics).to.be.an('array');
              expect(body.topics).to.have.lengthOf(3);
              expect(body.topics[0]).to.have.keys('slug', 'description')
            })
        })
      })
    });

    describe('/users', () => {
      describe('GET', () => {
        it('GET status:200 responds with a user with a matching username', () => {
          return request(app)
            .get('/api/users/icellusedkars')
            .expect(200)
            .then(({ body }) => {
              expect(body.user).to.have.keys('username', 'avatar_url', 'name');
              expect(body.user.username).to.equal('icellusedkars');
              expect(body.user.avatar_url).to.equal('https://avatars2.githubusercontent.com/u/24604688?s=460&v=4');
              expect(body.user.name).to.equal('sam');
            })
        })
        it('GET status:404 client requests a user with a username that does not exist on database', () => {
          return request(app)
            .get('/api/users/xylophone')
            .expect(404)
            .then(({ body }) => {
              expect(body.status).to.equal(404);
              expect(body.msg).to.equal('No user found for username: xylophone');
            })
        })
      })
    })

    describe('/articles', () => {
      describe('GET', () => {
        it('status:200 responds with an array of all articles', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.an('array');
              expect(body.articles).to.have.lengthOf(12);
              expect(body.articles[0]).to.have.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count');
              expect(body.articles[0].comment_count).to.equal('13');
            })
        })
        it(`status:200 sorts results by 'created_at', and in descending order - the defaults for each`, () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.descendingBy('created_at')
            })
        })
        it(`status:200 orders results by the given asc/des order (sorted by 'created_at' by default), if specified in query string`, () => {
          return request(app)
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.ascendingBy('created_at');
            })
        })
        it('status:200 sorts results by the given column (in default ascending order) if given one in the query string', () => {
          return request(app)
            .get('/api/articles?sort_by=author')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.descendingBy('author');
              expect(body.articles[0].author).to.equal('rogersop');
            })
        })
        it('status:200 is able to respond with results sorted by and ordered using query strings', () => {
          return request(app)
            .get('/api/articles?sort_by=title&order=asc')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.ascendingBy('title');
              expect(body.articles[0].title).to.equal('A');
            })
        })
        it('status:200 filters the articles by the username specified in the query', () => {
          return request(app)
            .get('/api/articles?author=icellusedkars')
            .expect(200)
            .then(({ body }) => {
              expect(_.every(body.articles, ['author', 'icellusedkars'])).to.equal(true);
              expect(body.articles).to.have.lengthOf(6);
            })
        })
        it('status:200 filters the articles by the topic specified in the query', () => {
          return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({ body }) => {
              expect(_.every(body.articles, ['topic', 'mitch'])).to.equal(true);
              expect(body.articles).to.have.lengthOf(11);
            })
        })
        it('status:200 succesfully handles all valid querystring options', () => {
          return request(app)
            .get('/api/articles?topic=mitch&author=rogersop&sort_by=title&order=asc')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[0].article_id).to.equal(10);
              expect(body.articles[0].title).to.equal('Seven inspirational thought leaders from Manchester UK');
            })
        })
        it(`status:400 for 'sort_by' a column that doesn't exist`, () => {
          return request(app)
            .get('/api/articles?sort_by=animal')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal('column "animal" does not exist');
            })
        });
        it('status:400 when order is neither "asc" / "desc"', () => { // i'm handling this as a custom error, because the in knex, it ignores an invalid sort_by. so sort_by 'banana' is ignored, and it just returns sorted by default 'desc', giving a status 200 OK. NO GOOD. I wanted to handle it (my choice of the 2 schools of thought as described by mitch.) --> so, I made a custom error.
          return request(app)
            .get('/api/articles?order=animal')
            .expect(400)
            .then(({ body }) => {
              expect(body.status).to.equal(400);
              expect(body.msg).to.equal('Invalid order: animal');
            })
        });
        it('status:404 author that is not in the database', () => {
          return request(app)
            .get('/api/articles?author=xylophone')
            .expect(404)
            .then(({ body }) => {
              expect(body.status).to.equal(404);
              expect(body.msg).to.equal(`No articles found - author 'xylophone' does not exist.`);
            })
        });
        it('status:404 topic that is not in the database', () => {
          return request(app)
            .get('/api/articles?topic=formicophilia')
            .expect(404)
            .then(({ body }) => {
              expect(body.status).to.equal(404);
              expect(body.msg).to.equal(`No articles found - topic 'formicophilia' does not exist.`);
            });
        });
        it('status:404 given both topic and author but neither exist in the database', () => {
          return request(app)
            .get('/api/articles?author=gorbachev&topic=chernobyl')
            .expect(404)
            .then(({ body }) => {
              expect(body.status).to.equal(404);
              expect(body.msg).to.equal(`No articles found - author 'gorbachev' and topic 'chernobyl' do not exist.`);
            });
        });
        it('status:404 author exists but does not have any articles associated with it', () => {
          return request(app)
            .get('/api/articles?author=lurker')
            .expect(404)
            .then(({ body }) => {
              expect(body.status).to.equal(404);
              expect(body.msg).to.equal(`No articles found - author 'lurker' hasn't written any yet.`);
            })
        });
        it('status:404 topic exists but does not have any articles associated with it', () => {
          return request(app)
            .get('/api/articles?topic=paper')
            .expect(404)
            .then(({ body }) => {
              expect(body.status).to.equal(404);
              expect(body.msg).to.equal(`No articles found - none currently exist on the topic of 'paper'. Be the first to write one!`);
            })
        });
        it(`status:404 both author and topic exist, but there aren't any articles associated with either`, () => {
          return request(app)
            .get('/api/articles?author=lurker&topic=paper')
            .expect(404)
            .then(({ body }) => {
              expect(body.status).to.equal(404);
              expect(body.msg).to.equal(`No articles found - 'lurker' hasn't written any articles, and 'paper' has no articles for it.`);
            });
        });
      });

      describe('/:article_id', () => {
        describe('GET', () => {
          it('status:200 responds with an article object for the given article_id', () => {
            return request(app)
              .get('/api/articles/1')
              .expect(200)
              .then(({ body }) => {
                expect(body.article).to.have.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count');
                expect(body.article.author).to.equal('butter_bridge');
                expect(body.article.title).to.equal('Living in the shadow of a great man');
                expect(body.article.comment_count).to.equal('13');
              })
          })
          it('status:400 when passed an invalid ID', () => {
            return request(app)
              .get('/api/articles/dog')
              .expect(400)
              .then(({ body }) => {
                expect(body.status).to.equal(400);
                expect(body.msg).to.equal('invalid input syntax for integer: "dog"');
              })
          })
          it('status:404 when resource does not exist', () => {
            return request(app)
              .get('/api/articles/99999')
              .expect(404)
              .then(({ body }) => {
                expect(body.status).to.equal(404);
                expect(body.msg).to.equal('No article found with article_id 99999')
              })
          })
        })

        describe('PATCH', () => {
          it('status:200 returns the updated article object with a newly incremented vote count', () => {
            return request(app)
              .patch('/api/articles/1')
              .send({
                inc_votes: 1
              })
              .expect(200)
              .then(({ body }) => {
                expect(body.article).to.eql({
                  article_id: 1,
                  title: 'Living in the shadow of a great man',
                  body: 'I find this existence challenging',
                  votes: 101,
                  topic: 'mitch',
                  author: 'butter_bridge',
                  created_at: '2018-11-15T12:21:54.171Z'
                })
                expect(body.article.votes).to.equal(101);
              })
          })
          it('status:200 returns the updated article object with a newly decremented vote count', () => {
            return request(app)
              .patch('/api/articles/1')
              .send({
                inc_votes: -50
              })
              .expect(200)
              .then(({ body }) => {
                expect(body.article).to.eql({
                  article_id: 1,
                  title: 'Living in the shadow of a great man',
                  body: 'I find this existence challenging',
                  votes: 50,
                  topic: 'mitch',
                  author: 'butter_bridge',
                  created_at: '2018-11-15T12:21:54.171Z'
                })
                expect(body.article.votes).to.equal(50);
              })
          })
          it('status:400 no inc_votes on request body', () => {
            return request(app)
              .patch('/api/articles/1')
              .send({})
              .expect(400)
              .then(({ body }) => {
                expect(body.status).to.equal(400);
                expect(body.msg).to.equal(`A key of inc_votes is required on the request body!`);
              })
          })

          it('status:400 Invalid inc_votes', () => {
            return request(app)
              .patch('/api/articles/1')
              .send({
                inc_votes: 'cat'
              })
              .expect(400)
              .then(({ body }) => {
                expect(body.status).to.equal(400);
                expect(body.msg).to.equal(`inc_votes of 'cat' is invalid - please provide an integer.`);
              })
          })

          it(`status:400 Some other property on request body `, () => {
            return request(app)
              .patch('/api/articles/1')
              .send({
                inc_votes: 5, name: 'Mitch'
              })
              .expect(400)
              .then(({ body }) => {
                expect(body.status).to.equal(400);
                expect(body.msg).to.equal(`Invalid additional keys on the request object - please only provide inc_votes.`);
              })
          })

        })

        describe('/comments', () => {
          describe('POST', () => {
            it('status:201 responds with a newly created comment for an article', () => {
              return request(app)
                .post('/api/articles/3/comments')
                .send({
                  username: 'rogersop',
                  body: 'Ha! Ha! These pug gifs sure made me chuckle.'
                })
                .expect(201)
                .then(({ body }) => {
                  expect(body.comment).to.have.keys('comment_id', 'author', 'article_id', 'votes', 'body', 'created_at');
                  expect(body.comment).to.eql({
                    'comment_id': 19,
                    'author': 'rogersop',
                    'article_id': 3,
                    'votes': 0,
                    'created_at': body.comment.created_at, // not quite sure best way to test this
                    'body': 'Ha! Ha! These pug gifs sure made me chuckle.'
                  })
                })
            })
            // error-handling -- status:400 invalid keys on post object, status:400 required fields ('username','body') missing
          })
          describe('GET', () => {
            it('status:200 responds with the comments for a given article when article has a single comment', () => {
              return request(app)
                .get('/api/articles/6/comments')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.have.lengthOf(1);
                  expect(body.comments[0]).to.have.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body');
                  expect(body.comments[0].comment_id).to.equal(16);
                  expect(body.comments[0].author).to.equal('butter_bridge');
                  expect(body.comments[0].article_id).to.equal(6);
                  expect(body.comments[0].votes).to.equal(1);
                  expect(body.comments[0].created_at).to.equal('2002-11-26T12:36:03.389Z');
                  expect(body.comments[0].body).to.equal('This is a bad article name');
                })
            })
            it('status:200 responds with the comments for a given article when article has multiple comment', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.have.lengthOf(13);
                  expect(body.comments[0]).to.have.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body');
                  expect(body.comments[12]).to.have.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body');
                  expect(body.comments[0].body).to.equal('The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.');
                  expect(body.comments[12].body).to.equal('This morning, I showered for nine minutes.');
                })
            })
            it('status:200 default sort_by = created_at, in desc order', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.descendingBy('created_at');
                })
            });
            it('status:200 can order_by asc', () => {
              return request(app)
                .get('/api/articles/1/comments?order=asc')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.ascendingBy('created_at');
                })
            });
            it('status:200 can sort_by given column alphabetically (eg. author)', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=author')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.descendingBy('author');
                })

            });
            it('status:200 can sort_by given column numerically (eg. votes)', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=votes')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.descendingBy('votes');
                })
            });
            it('status:200 can sort_by and order_by, eg (article_id in asc order)', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=article_id&order=asc')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.ascendingBy('article_id');
                })
            });
            it(`status:400 for 'sort_by' a column that doesn't exist`, () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=animal')
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal('column "animal" does not exist');
                })
            });
            it('status:400 when order is neither "asc" / "desc"', () => {
              return request(app)
                .get('/api/articles/1/comments?order=animal')
                .expect(400)
                .then(({ body }) => {
                  expect(body.status).to.equal(400);
                  expect(body.msg).to.equal('Invalid order: animal');
                })
            });
            it('status:404 when article_id doesn\'t have any comments yet', () => {
              return request(app)
                .get('/api/articles/12/comments')
                .expect(404)
                .then(({ body }) => {
                  expect(body.status).to.equal(404);
                  expect(body.msg).to.equal('This article has no comments yet.');
                })
            })
            it('status:404 when article_id doesn\'t exist', () => {
              return request(app)
                .get('/api/articles/9999/comments')
                .expect(404)
                .then(({ body }) => {
                  expect(body.status).to.equal(404);
                  expect(body.msg).to.equal('Article with article_id 9999 doesn\'t exist.');
                })
            });
          });

        });
      });
    });

    describe.only('comments', () => {
      describe('PATCH', () => {
        it('status:200 returns the updated comment object with a newly incremented vote count', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({
              inc_votes: 1
            })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment).to.eql({
                comment_id: 1,
                author: 'butter_bridge',
                article_id: 9,
                votes: 17,
                created_at: '2017-11-22T12:36:03.389Z',
                body: `Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!`,
              })
              expect(body.comment.votes).to.equal(17);
            })
        })
        it('status:200 returns the updated comment object with a newly decremented vote count', () => {
          return request(app)
            .patch('/api/comments/2')
            .send({
              inc_votes: -10
            })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment).to.eql({
                comment_id: 2,
                author: 'butter_bridge',
                article_id: 1,
                votes: 4,
                created_at: '2016-11-22T12:36:03.389Z',
                body: `The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.`,
              })
              expect(body.comment.votes).to.equal(4);
            })
        })
        it('status:400 no inc_votes on request body', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({})
            .expect(400)
            .then(({ body }) => {
              expect(body.status).to.equal(400);
              expect(body.msg).to.equal(`A key of inc_votes is required on the request body!`);
            })
        })

        it('status:400 Invalid inc_votes', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({
              inc_votes: 'cat'
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.status).to.equal(400);
              expect(body.msg).to.equal(`inc_votes of 'cat' is invalid - please provide an integer.`);
            })
        })

        it(`status:400 Some other property on request body `, () => {
          return request(app)
            .patch('/api/comments/1')
            .send({
              inc_votes: 5, name: 'Mitch'
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.status).to.equal(400);
              expect(body.msg).to.equal(`Invalid additional keys on the request object - please only provide inc_votes.`);
            })
        })
      })
    })
  });
});
