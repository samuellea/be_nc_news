const formatTimestamp = (objects) => {
  if (!objects.length) return [];
  return objects.map((object) => {
    if (object.created_at) {
      const { created_at, ...restOfObject } = object;
      const formattedTime = new Date(created_at);
      return { ...restOfObject, created_at: formattedTime };
    }
  })
}

const createRef = (articles) => {
  const ref = {};
  for (let i = 0; i < articles.length; i++) {
    ref[articles[i].title] = articles[i].article_id
  }
  return ref;
};

const formatComments = (comments, articles) => {
  let refObj = createRef(articles);
  return formatTimestamp(comments).map((comment) => {
    const { created_by, belongs_to, ...restOfObject } = comment;
    return { ...restOfObject, article_id: refObj[comment.belongs_to], author: comment.created_by };
  })
}

module.exports = { formatTimestamp, createRef, formatComments }