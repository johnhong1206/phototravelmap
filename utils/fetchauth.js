export const signinuser = async (signInInfo) => {
  const res = await fetch(`/api/signin`, {
    body: JSON.stringify(signInInfo),
    method: "POST",
  });
  const data = await res.json();
  return data;
};
export const signupuser = async (signUpInfo) => {
  const res = await fetch(`/api/signup`, {
    body: JSON.stringify(signUpInfo),
    method: "POST",
  });
  const data = await res.json();
  return data;
};
