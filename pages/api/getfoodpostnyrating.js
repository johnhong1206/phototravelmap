import sanityClient from "@sanity/client";
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};
const client = sanityClient(config);
export default async function handler(req, res) {
  const query = `*[_type == "post" && count((categories[]->slug.current)[@ in ['food']]) > 0 ]{
        _id,
        title,
        author->{
          _id,
          ...,
        },
        slug,
        rating,
        publishedAt,
        categories[0]->{
          _id,
          ...,
        },
        mainImage,
        location->{
          _id,
          ...,
        },
      }| order(totalrating desc)`;

  const postsRes = await client.fetch(query);
  const posts = postsRes.sort((b, a) => a.rating - b.rating);

  res.status(200).json({ posts });
}
