import sanityClient from "@sanity/client";
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};
const client = sanityClient(config);
export default async function handler(req, res) {
  const {
    title,
    tripComplete,
    user,
    tripDate,
    location,
    description,
    email,
    slug,
  } = JSON.parse(req.body);

  try {
    await client.create({
      _type: "tripplans",
      title: title,
      tripComplete: tripComplete,
      email: email,
      author: {
        _type: "reference",
        _ref: user,
      },
      tripDate,
      slug: {
        _type: "slug",
        current: slug,
      },
      location: {
        _type: "reference",
        _ref: location,
      },
      description: description,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `Couldn't submit plan`, err });
  }

  res.status(200).json({ message: "Plan Created" });
}
