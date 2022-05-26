import sanityClient from "@sanity/client";
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};
const client = sanityClient(config);
export default async function handler(req, res) {
  try {
    await client
      .delete("oo08fRIX23oBjTTm1h3WNA")
      .then(() => {
        console.log("Delete");
      })
      .catch((err) => {
        console.error("Delete failed: ", err.message);
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `Couldn't submit comment`, err });
  }

  res.status(200).json({ message: "Post delete" });
}
