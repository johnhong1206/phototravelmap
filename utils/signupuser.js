export const signupuser = async (signUpInfo) => {
  console.log("signUpInfo", signUpInfo);

  const res = await fetch(`/api/signup`, {
    body: JSON.stringify(signUpInfo),
    method: "POST",
  });
  const data = await res.json();
  return data;
};
