export const fetchPost = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getallpost`);
  const data = await res.json();
  const post = data.posts;
  return post;
};

export const fetchTravelPostOrderByRating = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getalltravelpostbyrating`
  );
  const data = await res.json();
  const post = data.posts;
  return post;
};
export const fetchFoodPostOrderByRating = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getfoodpostnyrating`
  );
  const data = await res.json();
  const post = data.posts;
  return post;
};
export const fetchpostdetails = async (postSlug) => {
  const postInfo = {
    slug: postSlug,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getpostdetails`,
    { body: JSON.stringify(postInfo), method: "POST" }
  );
  const data = await res.json();
  const post = data.posts;
  return post;
};

export const fetchpostrating = async (postId) => {
  const postInfo = {
    id: postId,
  };
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getpostrating`,
    { body: JSON.stringify(postInfo), method: "POST" }
  );
  const data = await res.json();
  console.log("data", data);
  const rating = data.rating;
  return rating;
};

export const fetchgeopost = async (location) => {
  const postInfo = {
    location: location,
  };
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getgeopost`,
    { body: JSON.stringify(postInfo), method: "POST" }
  );
  const data = await res.json();
  const post = data.posts;

  return post;
};

export const fetchgeopostwithemail = async (email) => {
  const postInfo = {
    email: email,
  };
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getpostwithuseremail`,
    { body: JSON.stringify(postInfo), method: "POST" }
  );
  const data = await res.json();
  const post = data.posts;

  return post;
};
export const fetchgeopostwithemailrating = async (email) => {
  const postInfo = {
    email: email,
  };
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getpostwithuseremailrating`,
    { body: JSON.stringify(postInfo), method: "POST" }
  );
  const data = await res.json();
  const post = data.posts;

  return post;
};
