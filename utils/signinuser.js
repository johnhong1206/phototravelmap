export const signinuser = async (signInInfo) => {
  console.log("signInInfo", signInInfo);

  const res = await fetch(`/api/signin`, {
    body: JSON.stringify(signInInfo),
    method: "POST",
  });
  const data = await res.json();
  return data;
};
