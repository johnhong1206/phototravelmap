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
  const userquery = `*[_type == "author"]{
      ...    
}`;

  const user = await client.fetch(userquery, { email: email });
  const userExist = user?.find((user) => user.email === email);
  const usernameExist = user?.find(
    (user) => user.name.toLocaleLowerCase() === username.toLocaleLowerCase()
  );
  console.log("user", user);
  console.log("userExist>>>", !!userExist);
  console.log("user name exist >>>", !!usernameExist, user);

  if (!!userExist === false && !!usernameExist === false) {
    await client.create({
      _type: "author",
      name: username,
      email: email,
      password: password,
    });
    const token = jwt.sign({ sub: email }, serverRuntimeConfig, {
      expiresIn: "1d",
    });

    res.status(200).json({
      username: username,
      email: email,
      token,
      message: "Sign Up Success",
    });
  }
  if (!!userExist === false && !!usernameExist === true) {
    res.status(400).json({
      username: username,
      email: email,
      message: "Username is used please try another",
    });
  }
  if (!!userExist === true) {
    res
      .status(400)
      .json({ username: username, email: email, message: "User Exist" });
  }
}
