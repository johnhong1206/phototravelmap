import sanityClient from "@sanity/client";
import { basename } from "path";
import { createReadStream } from "fs";

const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};
const client = sanityClient(config);
const filePath = "/Users/Admin/Desktop/code/next/phototravelmap/image/img.jpg";
const newfilePath = "C:UsersAdminAppDataLocalTemp\v3N6vCw04D8WmRNjGalyq9M2.jpg";

export default async function handler(req, res) {
  const { id } = req.body;
  console.log("req", req.body);
  console.log("body._id", id);
  client.assets
    .upload("image", createReadStream(newfilePath), {
      filename: basename(newfilePath),
    })
    .then((imageAsset) => {
      // Here you can decide what to do with the returned asset document.
      // If you want to set a specific asset field you can to the following:
      return client
        .patch("YaLUR16LAR66zf2wm9UHag")
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
    .then(() => {
      console.log("Done!");
    });
}
