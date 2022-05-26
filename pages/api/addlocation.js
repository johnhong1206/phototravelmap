// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sanityClient from "@sanity/client";
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};
const client = sanityClient(config);

export default async function handler(req, res) {
  const { title, state, longitude, latitude, address, description } =
    JSON.parse(req.body);
  console.log("req.body", req.body);
  try {
    await client.create({
      _type: "location",
      title: title,
      state: state,
      longitude: longitude,
      latitude: latitude,
      address: address,
      description: description,
      slug: {
        _type: "slug",
        current: title,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `Couldn't submit`, err });
  }
  console.log("location Submit");
  console.log("Locarion is posted");
  res.status(200).json({ message: "Location Submit" });
}
