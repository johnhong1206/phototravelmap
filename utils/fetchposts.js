// export const fetchPost = async () => {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getallpost`);
//   const data = await res.json();
//   const post = data.posts;
//   return post;
// };
import sanityClient from "@sanity/client";
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};
const client = sanityClient(config);

export const fetchPost = async () => {
  const query = `*[_type == "post"]{
    ...,
    author->{
      _id,
      ...,
    },
    rating,
    publishedAt,
    categories[]->{   
      ...,
    },
    mainImage,
    location->{
          ...,
    },
  }| order(_createdAt desc)`;
  const posts = await client.fetch(query);

  return posts;
};

export const fetchpostdetails = async (postSlug) => {
  const slug = postSlug;
  // const postInfo = {
  //   slug: postSlug,
  // };
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    author->{
      name,
      image
    },
    description,
    mainImage,
    slug,
    categories[]->{
      ...
    },
    rating,
    location->{
      ...
    },
    categoryTags
  }`;
  const post = await client.fetch(query, {
    slug: slug,
  });
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_BASE_URL}/api/getpostdetails`,
  //   { body: JSON.stringify(postInfo), method: "POST" }
  // );
  // const data = await res.json();
  // const post = data.posts;
  return post;
};

export const fetchpostrating = async (postId) => {
  const postInfo = {
    id: postId,
  };
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getpostrating`,
    { body: JSON.stringify(postInfo), method: "POST" }
  );
  const data = await res.json();
  const rating = data.rating;
  return rating;
};
