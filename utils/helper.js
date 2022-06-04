export const getUniqueValues = (data, type) => {
  let unique = data.map((item) => item[type]);
  if (type === "categoryTags") {
    unique = unique.flat();
  }

  return [...new Set(unique)];
};
