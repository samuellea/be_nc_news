const { expect } = require('chai')
const { formatTimestamp } = require('../utils/')

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

// describe('xxx()', () => {
//   it('', () => {

//   })
// })