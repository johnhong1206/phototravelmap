import sanityClient from "@sanity/client";
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};
const client = sanityClient(config);
export default async function handler(req, res) {
  const { email } = JSON.parse(req.body);
  const tripplansquery = `*[_type == "tripplans" && email == $email ]{
    ...
  }| order(_createdAt desc)`;
  const tripplans = await client.fetch(tripplansquery, {
    email: email,
  });

  res.status(200).json({ tripplans });
}
