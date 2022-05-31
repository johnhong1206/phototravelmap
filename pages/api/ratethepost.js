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
    _id,
    ratedUserName,
    ratedUserEmail,
    ratedUserId,
    rating,
    ratingTitle,
    comment,
  } = JSON.parse(req.body);

  try {
    await client.create({
      _type: "rating",
      ratedPostTitle: ratingTitle,
      ratedUserName: ratedUserName,
      ratedUserEmail: ratedUserEmail,
      ratedUserId: ratedUserId,
      rating: Number(rating),
      ratedPostId: _id,
      comment: comment,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `Couldn't submit rating`, err });
  }

  res.status(200).json({ message: "Rating Update" });
}
