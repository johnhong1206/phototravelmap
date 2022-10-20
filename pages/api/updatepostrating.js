import sanityClient from "@sanity/client";
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};
const client = sanityClient(config);
export default async function handler(req, res) {
  const { _id, rating, totalrating, totaluserrate } = JSON.parse(req.body);

  console.log(req.body);

  try {
    await client
      .patch(_id)
      .set({
        rating: Number(rating),
        totalrating: Number(totalrating),
        totaluserrate: Number(totaluserrate),
      })
      .commit({
        // Adds a `_key` attribute to array items, unique within the array, to
        // ensure it can be addressed uniquely in a real-time collaboration context
        autoGenerateArrayKeys: true,
      })
      .then((updated) => {
        console.log("Update");
        console.log(updated);
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `Couldn't submit`, err });
  }

  res.status(200).json({ message: "Rating Update" });
}
