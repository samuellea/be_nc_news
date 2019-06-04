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