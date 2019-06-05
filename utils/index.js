exports.formatTimestamp = (objects) => {
  if (!objects.length) return [];
  return objects.map((object) => {
    if (object.created_at) {
      const { created_at, ...restOfObject } = object;
      const formattedTime = new Date(created_at);
      return { ...restOfObject, created_at: formattedTime };
    }
  })
}

exports.createRef = (articles) => {
  const ref = {};
  for (let i = 0; i < articles.length; i++) {
    ref[articles[i].title] = articles[i].article_id
  }
  return ref;
};

exports.reformatCommentBelong = (comments) => {
  // uses the reference object from createRef here.
  // go through all the comments... for each comment...
  // check in the ref object what the article_id value of 'belongs_to' is
  // then, set that value (eg. '1') as the value of a new property of 'article_id' on the comment object.


}