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
  const {
    title,
    postType,
    publishedAt,
    category,
    author,
    location,
    slug,
    rating,
  } = JSON.parse(req.body);

  try {
    await client
      .create({
        _type: "post",
        title: title,
        rating: rating,
        postType: postType.toString(),
        author: {
          _type: "reference",
          _ref: author,
        },
        publishedAt,
        slug: {
          _type: "slug",
          current: slug,
        },
        location: {
          _type: "reference",
          _ref: location,
        },
      })
      .then((res) => {
        return client
          .patch(res._id)
          .set({ categories: [] })
          .insert("after", "categories[-1]", [
            {
              _ref: category,
            },
          ])
          .commit({
            // Adds a `_key` attribute to array items, unique within the array, to
            // ensure it can be addressed uniquely in a real-time collaboration context
            autoGenerateArrayKeys: true,
          });
      });

    console.log(req.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `Couldn't submit comment`, err });
  }
  console.log("Comment Submit");
  console.log("Post is posted");
  res.status(200).json({ message: "Post Submit" });
}
