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

const generateArticlesErrMsg = (searchResults, author, topic) => {
  let messageOption;
  const onlyAuthor = Array.isArray(searchResults[0]) && searchResults[0].length > 0;
  const onlyTopic = Array.isArray(searchResults[1]) && searchResults[1].length > 0;
  const justNoAuthor = Array.isArray(searchResults[0]) && !searchResults[0].length;
  const justNoTopic = Array.isArray(searchResults[1]) && !searchResults[1].length;
  const neitherAuthorNorTopic = justNoAuthor && justNoTopic;
  const bothAuthorAndTopic = onlyAuthor && onlyTopic;
  if (onlyAuthor) messageOption = `author '${author}' hasn't written any yet.`;
  if (onlyTopic) messageOption = `none currently exist on the topic of '${topic}'. Be the first to write one!`;
  if (bothAuthorAndTopic) messageOption = `'${author}' hasn't written any articles, and '${topic}' has no articles for it.`
  if (justNoAuthor) messageOption = `author '${author}' does not exist.`;
  if (justNoTopic) messageOption = `topic '${topic}' does not exist.`;
  if (neitherAuthorNorTopic) messageOption = `author '${author}' and topic '${topic}' do not exist.`;
  return messageOption;
}

module.exports = { formatTimestamp, createRef, formatComments, generateArticlesErrMsg }