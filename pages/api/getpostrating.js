import sanityClient from "@sanity/client";
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};
const client = sanityClient(config);
export default async function handler(req, res) {
  const { id } = JSON.parse(req.body);
  const query = `*[_type == "rating" && ratedPostId == $id]{
        ...
    }`;
  const rating = await client.fetch(query, {
    id: id,
  });
  console.log(rating);

  res.status(200).json({ rating });
}
