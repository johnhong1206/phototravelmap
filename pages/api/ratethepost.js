import sanityClient from "@sanity/client";
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};
const client = sanityClient(config);
export default async function handler(req, res) {
  const { _id, author, rating, ratingTitle, comment } = JSON.parse(req.body);
  console.log(ratingTitle.toString());
  try {
    await client
      .create({
        _type: "rating",
        ratedPostTitle: ratingTitle,
        ratedUserId: author,
        rating: Number(rating),
        ratedPostID: _id,
        comment: comment,
      })
      .then((rating) => {
        client
          .patch(_id)
          .setIfMissing({ rating: [] })
          .insert("after", "rating[-1]", [
            {
              _ref: rating?._id,
            },
          ])
          .commit({
            // Adds a `_key` attribute to array items, unique within the array, to
            // ensure it can be addressed uniquely in a real-time collaboration context
            autoGenerateArrayKeys: true,
          });
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `Couldn't submit rating`, err });
  }

  res.status(200).json({ message: "Rating Update" });
}
