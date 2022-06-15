import sanityClient from "@sanity/client";
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};
const client = sanityClient(config);
export default async function handler(req, res) {
  const { slug } = JSON.parse(req.body);
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
  const posts = await client.fetch(query, {
    slug: slug,
  });

  res.status(200).json({ posts });
}
