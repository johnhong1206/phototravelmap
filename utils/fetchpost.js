export const fetchPost = async () => {
  const res = await fetch`/api/fetchpost`;
  const data = await res.json();
  const post = data.post;
  return post;
};
