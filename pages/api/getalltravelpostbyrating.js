import sanityClient from "@sanity/client";
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};
const client = sanityClient(config);
export default async function handler(req, res) {
  const query = `*[_type == "post" && postType == 'public' && count((categories[]->slug.current)[@ in ['travel']]) > 0  ]{
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
    totalrating,
    location->{
          ...,
    },
  }| order(totalrating desc)`;
  const postsRes = await client.fetch(query);
  const posts = postsRes.sort((b, a) => a.rating - b.rating);

  res.status(200).json({ posts });
}
