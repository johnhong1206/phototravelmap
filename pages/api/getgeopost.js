import sanityClient from "@sanity/client";
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};
const client = sanityClient(config);
export default async function handler(req, res) {
  const { location } = JSON.parse(req.body);
  console.log("location: ", location);
  const filterInput = location.toString();
  const query = `*[_type == "post"]{
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
  }| order(_createdAt desc)`;
  const allPosts = await client.fetch(query);
  const posts = filterData(allPosts, filterInput);

  function filterData(posts, filterInput) {
    const excludeColumns = [];
    let value = filterInput.toString();
    let dataList = posts;
    const Value = value.toLocaleUpperCase().trim();
    if (Value === "") return dataList;
    else {
      const filteredData = dataList?.filter((item) => {
        return Object.keys(item.location).some((key) =>
          excludeColumns.includes(key)
            ? false
            : item.location[key]?.toString().toLocaleUpperCase().includes(Value)
        );
      });
      return filteredData;
    }
  }
  console.log(posts.length);
  res.status(200).json({ posts });
}
