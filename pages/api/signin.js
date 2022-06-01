import sanityClient from "@sanity/client";
import jwt from "jsonwebtoken";

const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};
const client = sanityClient(config);
export default async function handler(req, res) {
  const serverRuntimeConfig = process.env.TOKEN;
  const { username, email, password } = JSON.parse(req.body);
  const userquery = `*[_type == "author" && email == $email]{
    ...
}`;
  const user = await client.fetch(userquery, { email: email });

  const userExist = user?.find((user) => user.email === email);
  console.log("userExist", !!userExist, userExist);

  if (!!userExist == true) {
    if (userExist?.password === password) {
      try {
        const token = jwt.sign({ sub: email }, serverRuntimeConfig, {
          expiresIn: "1d",
        });

        return res.status(200).json({
          name: userExist?.name,
          email: email,
          id: userExist?._id,
          token,
          message: "Sign In Success",
        });
      } catch (err) {
        res.status(400).json("Wrong Credentials!");
      }
    } else {
      res.status(400).json({ email: email, message: "Wrong Password!!!" });
    }
  } else {
    res.status(400).json({ email: email, message: "User Not Exist" });
  }
}
