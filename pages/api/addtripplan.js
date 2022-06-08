import sanityClient from "@sanity/client";
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};
const client = sanityClient(config);
export default async function handler(req, res) {
  const { title, referenceTripPlan, date, time, location, thingstodo, email } =
    JSON.parse(req.body);
  console.log(req.body);

  try {
    await client
      .create({
        _type: "tripDetails",
        title: title,
        referenceTripPlan: referenceTripPlan,
        email: email,
        date: date,
        time: time,
        location: {
          _type: "reference",
          _ref: location,
        },
        thingstodo: thingstodo,
      })
      .then((res) => {
        console.log("res", res?._id);
        return client
          .patch(referenceTripPlan)
          .setIfMissing({ tripDetails: [] })
          .insert("after", "tripDetails[-1]", [
            {
              _ref: res?._id,
            },
          ])
          .commit({
            // Adds a `_key` attribute to array items, unique within the array, to
            // ensure it can be addressed uniquely in a real-time collaboration context
            autoGenerateArrayKeys: true,
          });
      })
      .then((res) => {
        console.log("res", res, "success");
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `Couldn't submit`, err });
  }
  res.status(200).json({ message: "Plan Update" });
}
