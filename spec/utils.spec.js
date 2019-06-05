const { expect } = require('chai')
const { formatTimestamp, createRef, formatComments } = require('../utils/')

describe('formatTimestamp()', () => {
  it('returns an empty array if passed an empty array', () => {
    const objects = [];
    const actual = formatTimestamp(objects);
    const expected = [];
    expect(actual).to.eql(expected);
  })
  it('returns a single-object array with the \'created_at\' unix timestamp value reformatted for SQL insertion', () => {
    const objects = [{ id: 1, created_at: 1542284514171 }];
    const actual = formatTimestamp(objects);
    const formattedTime = new Date(1542284514171);
    const expected = [{ id: 1, created_at: formattedTime }];
    expect(actual).to.eql(expected);
  })
  it('reformats the \'created_at\' value for an array of objects', () => {
    const objects = [{ id: 1, created_at: 1542284514171 }, { id: 2, created_at: 406988514171 }];
    const actual = formatTimestamp(objects);
    const formattedTime1 = new Date(1542284514171);
    const formattedTime2 = new Date(406988514171);
    const expected = [{ id: 1, created_at: formattedTime1 }, { id: 2, created_at: formattedTime2 }];
    expect(actual).to.eql(expected);
  })
})

describe('createRef()', () => {
  it('creates a reference object for a single article, with a key of it\'s title and a value of it\'s article_id', () => {
    const article = [{
      article_id: 1,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
    }];
    const actual = createRef(article);
    const expected = {
      'Living in the shadow of a great man': 1
    };
    expect(actual).to.eql(expected);
  })
  it('creates a reference object for an array of article objects', () => {
    const articles = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      },
      {
        article_id: 2,
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body:
          'Call me Mitchell.',
        created_at: 1416140514171,
        votes: 50
      }
    ];
    const actual = createRef(articles);
    const expected = {
      'Living in the shadow of a great man': 1, 'Sony Vaio; or, The Laptop': 2
    };
    expect(actual).to.eql(expected);
  });
});

describe('formatComments()', () => {
  it(`reformats a single comment's keys and properties, changing 'created_by' to 'author', \n 'belongs_to' to 'article_id' with an article's id value, and the 'created_at' value to a JS Date object`, () => {
    const article = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      }
    ]
    const comment = [
      {
        created_at: 1511354163389,
        created_by: 'butter_bridge',
        belongs_to: 'Living in the shadow of a great man',
      }
    ];
    const formattedTime = new Date(1511354163389);
    const actual = formatComments(comment, article)
    const expected = [
      {
        created_at: formattedTime,
        author: 'butter_bridge',
        article_id: 1,
      }
    ]
    expect(actual).to.eql(expected);
  });
  it('reformats multiple comment objects', () => {
    const articles = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      },
      {
        article_id: 2,
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body:
          'Call me Mitchell.',
        created_at: 1416140514171,
        votes: 50
      }
    ]
    const comments = [
      {
        comment_id: 1,
        body: "I think things are a certain way. The end.",
        votes: 16,
        created_at: 1511354163389,
        created_by: 'butter_bridge',
        belongs_to: 'Living in the shadow of a great man',
      },
      {
        comment_id: 2,
        body: "I must say I like this article.",
        votes: 1,
        created_at: 1511354163600,
        created_by: 'lemon_jelly',
        belongs_to: 'Sony Vaio; or, The Laptop',
      }
    ];
    const formattedTime1 = new Date(1511354163389);
    const formattedTime2 = new Date(1511354163600);
    const actual = formatComments(comments, articles);
    const expected = [
      {
        comment_id: 1,
        body: "I think things are a certain way. The end.",
        votes: 16,
        created_at: formattedTime1,
        author: 'butter_bridge',
        article_id: 1,
      },
      {
        comment_id: 2,
        body: "I must say I like this article.",
        votes: 1,
        created_at: formattedTime2,
        author: 'lemon_jelly',
        article_id: 2,
      }
    ]
    expect(actual).to.eql(expected);
  });
});
