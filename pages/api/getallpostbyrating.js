import sanityClient from "@sanity/client";
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};
const client = sanityClient(config);
export default async function handler(req, res) {
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
  }| order(rating desc)`;
  const posts = await client.fetch(query);

  res.status(200).json({ posts });
}
