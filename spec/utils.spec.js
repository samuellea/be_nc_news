const { expect } = require('chai')
const { formatTimestamp, createRef } = require('../utils/')

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
      }
    ];
    const actual = createRef(articles);
    const expected = {
      'Living in the shadow of a great man': 1, 'Sony Vaio; or, The Laptop': 2
    };
    expect(actual).to.eql(expected);
  })
})


    // iterate across comments from data
    // for each comment,
    // take its 'belongs_to' value, and find the article with article.title the same as this.
    // having found that, take that article's article.article_id,
    // then replace the comment's 'belongs_to' property with 'article_id' with this retreived article.article_id
    // result? --> an array of reformatted comments.
    // question - WHY a reference object? what's that required for?
    // because... we've gotta change TWO things for each comment? well, THREE, really -- created_by, belongs_to and created_at...
    // so are we creating three seperate utils sub functions, and combining them in the seed file..
    // or combining them in a seperate utils big function that uses those three... 'formatComments'...? 

    // const comment = {
    //   body: "I think things are a certain way. The end.",
    //   votes: 16,
    //   created_at: 1511354163389,
    //   created_by: 'butter_bridge', // --> 
    //   belongs_to: "They're not exactly dogs, are they?", // --> get its article_id ... where ... article.title
    // }
    // const expected = {
    //   body: "I think things are a certain way. The end.",
    //   votes: 16,
    //   created_at: 1511354163389,
    //   author: 'butter_bridge', // !
    //   article_id: 1, // !
    // }