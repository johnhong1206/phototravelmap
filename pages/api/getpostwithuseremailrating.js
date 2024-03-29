import sanityClient from "@sanity/client";
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};
const client = sanityClient(config);

export default async function handler(req, res) {
  const { email } = JSON.parse(req.body);
  const query = `*[_type == "post" && references(*[_type=='author' && email == $email]._id)]{
    ...,
    author->{
      _id,
      ...,
    },
    rating,
    publishedAt,
    categories[]->{   
      ...,
    },
    mainImage,
    location->{
          ...,
    },
  }| order(totalrating desc)`;

  const postsRes = await client.fetch(query, {
    email: email,
  });

  const posts = postsRes.slice().sort((b, a) => a.totalrating - b.totalrating);

  res.status(200).json({ posts });
}
