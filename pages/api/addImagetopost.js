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

export default async function handler(req, res) {
  const { id } = req.body;
  console.log("req", req.body);
  console.log("body._id", id);
  // return client.assets.upload("image", createReadStream(req.file), {
  //   filename: basename(req.file),
  // });

  res.status(200).json({ message: "Location Submit" });
}
