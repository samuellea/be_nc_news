process.env.NODE_ENV = 'test';
// using test data here.
// but test db hasn't been seeded - body getting back for GET /api/users/:username is {}!
// so how to seed BOTH test and dev dbs? am i not?

const { expect } = require('chai');
const request = require('supertest');

const app = require('../app');
const connection = require('../db/connection');

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
              expect(body.topics[0]).to.have.keys('slug', 'description')
            })
        })
      })
      // default sort_by slug alphabetically
      // can change order to desc
      // can change sort_by to 'description'
      // can do both (change order and sort_by)
      // error if sort_by to something neither 'description' or 'slug' --> 404 Not Found ... or 400 Bad Request??
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
            .get('/api/users/jessjelly')
            .expect(404)
        })
      })

    })


  });
});
