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

      // describe('/:article_id', () => {
      //   describe('GET', () => {
      //     it('status:200 responds with an article object for the given article_id', () => {
      //       return request(app)
      //         .get('/api/articles/1')
      //         .expect(200)
      //         .then(({ body }) => {
      //           expect(body.article).to.have.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count');
      //           expect(body.article.author).to.equal('butter_bridge');
      //           expect(body.article.title).to.equal('Living in the shadow of a great man');
      //           expect(body.article.comment_count).to.equal('');


      //         })
      //     })
      //   })
      // })

    });
  });
});

