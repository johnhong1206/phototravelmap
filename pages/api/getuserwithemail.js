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
  const query = `*[_type == "author" && email == $email][0]{
...
  }`;

  const userprofile = await client.fetch(query, {
    email: email,
  });

  res.status(200).json({ userprofile });
}
