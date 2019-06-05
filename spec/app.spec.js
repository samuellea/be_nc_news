process.env.NODE_ENV = 'test';

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


  });
});
