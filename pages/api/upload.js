import middleware from "../../middleware/middleware";
import nextConnect from "next-connect";
import sanityClient from "@sanity/client";
import { basename } from "path";
import { createReadStream } from "fs";

const client = sanityClient({
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
});

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res) => {
  const files = req.files["image"];
  const id = req.body["id"][0].toString();
  const filePath = files[0]?.path.toString();

  console.log("files", filePath);
  console.log("id", id);

  try {
    await client.assets
      .upload("image", createReadStream(filePath), {
        filename: basename(filePath),
      })
      .then((imageAsset) => {
        // Here you can decide what to do with the returned asset document.
        // If you want to set a specific asset field you can to the following:
        return client
          .patch(id)
          .set({
            mainImage: {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: imageAsset._id,
              },
            },
          })
          .commit();
      })
      .then((response) => {
        console.log("success");
        res.status(200).json({ message: "upload" });
      })
      .catch((err) => {
        console.error(err);
        return res
          .status(500)
          .json({ message: `Couldn't submit comment`, err });
      });
  } catch (err) {
    console.error(err);
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
