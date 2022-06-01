import React, { useState } from "react";
import toast from "react-hot-toast";
import { login } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Head from "next/head";

function Signup() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const isInvalid = username === "" || password === "" || email === "";
  const navSignIn = () => {
    router.push(`/signin`);
  };
  const signupuser = async (signUpInfo) => {
    console.log("signUpInfo", signUpInfo);

    const res = await fetch(`/api/signup`, {
      body: JSON.stringify(signUpInfo),
      method: "POST",
    });
    const data = await res.json();
    return data;
  };

  const signinuser = async (signInInfo) => {
    console.log("signInInfo", signInInfo);

    const res = await fetch(`/api/signin`, {
      body: JSON.stringify(signInInfo),
      method: "POST",
    });
    const data = await res.json();
    return data;
  };

  const signUp = async () => {
    const notification = toast.loading("Sign Up...");
    const signUpInfo = {
      username: username,
      email: email,
      password: password,
    };

    await signupuser(signUpInfo).then((res) => {
      if (res.message == "Sign Up Success") {
        toast.success(`${res.email} ${res.message}`, { id: notification });
        signinuser(signUpInfo).then((res) => {
          console.log("res", res);
          dispatch(
            login({
              username: res.name,
              email: res.email,
              token: res.token,
              admin: false,
              id: res.id,
            })
          );
          router.push("/");
        });
      }
      if (res.message == "User Exist") {
        setEmailError(res.message);
        toast.error(`${res.email} ${res.message}`, { id: notification });
      }

      if (res.message == "Username is used please try another") {
        setUsernameError(res.message);
        toast.error(`${res.username} this ${res.message}`, {
          id: notification,
        });
      }
    });
  };
  return (
    <div className="h-screen p-4">
      <Head>
        <title>Login</title>
        <meta name="description" content="Best pizza shop in town" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto grid place-items-center h-1/2">
        <h1 className="text-4xl">Sign Up</h1>
        <div className={`mt-10`}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            arial-label="Enter your email"
            placeholder={usernameError === null ? "Username" : usernameError}
            className={`text-sm text-gray-500 w-full pr-3 py-5 px-4 border border-gray-primary rounded mb-2 focus-within:shadow-lg outline-none
      ${usernameError !== null && "border-2 border-red-500"}`}
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            arial-label="Enter your email"
            placeholder={emailError === null ? "Email" : emailError}
            className={`text-sm text-gray-500 w-full pr-3 py-5 px-4 border border-gray-primary rounded mb-2 focus-within:shadow-lg outline-none
      ${emailError !== null && "border-2 border-red-500"}`}
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            arial-label="Enter your password"
            placeholder={passwordError === null ? "Password" : passwordError}
            className={`text-sm text-gray-500 w-full pr-3 py-5 px-4 border border-gray-primary rounded mb-2 focus-within:shadow-lg outline-none
    ${passwordError !== null && "border-2 border-red-500"}`}
          />
          <button
            onClick={signUp}
            type="submit"
            className={`bg-[#008080] bg-gradient-to-r from-[#06202A]  text-white w-full rounded h-10 lg:h-8 font-bold hover:shadow-xl ${
              isInvalid && "opacity-50 "
            }`}
          >
            Sign Up
          </button>
        </div>
        <p className="text-sm font-medium">
          Already Have Account ? Please{" "}
          <span onClick={navSignIn} className="hover:underline cursor-pointer">
            Sign In
          </span>
        </p>
      </main>
    </div>
  );
}

export default Signup;
