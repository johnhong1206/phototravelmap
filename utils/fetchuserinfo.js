export const fetchalluser = async (email) => {
  const postInfo = {
    email: email,
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getusers`, {
    body: JSON.stringify(postInfo),
    method: "POST",
  });
  const data = await res.json();
  const userprofiles = data.userprofiles;

  return userprofiles;
};

export const fetuserprofile = async (email) => {
  const postInfo = {
    email: email,
  };
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getuserwithemail`,
    { body: JSON.stringify(postInfo), method: "POST" }
  );
  const data = await res.json();
  const userprofile = data.userprofile;

  return userprofile;
};
