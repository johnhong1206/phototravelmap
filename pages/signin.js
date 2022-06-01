import React, { useState } from "react";
import toast from "react-hot-toast";
import { login } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Head from "next/head";

function Signin() {
  const url =
    process.env.NODE_ENV === "production"
      ? "https://zhphototravelmap.netlify.app/"
      : "localhost:3000";

  console.log("url", url);
  const router = useRouter();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const isInvalid = password === "" || email === "";
  const navSIgnUp = () => {
    router.push(`/signup`);
  };

  const signinuser = async (signInInfo) => {
    console.log("signInInfo", signInInfo);

    const res = await fetch(`/api/signin`, {
      body: JSON.stringify(signInInfo),
      method: "POST",
    });
    console.log(res);

    const data = await res.json();
    return data;
  };

  const signIn = async () => {
    const notification = toast.loading("Sign In...");
    const signInInfo = {
      username: username,
      email: email,
      password: password,
    };

    await signinuser(signInInfo).then((res) => {
      if (res.message === "Sign In Success") {
        if (res.email === "jackyjohn1206@gmail.com") {
          dispatch(
            login({
              username: res.name,
              email: res.email,
              id: res.id,
              token: res.token,
              admin: true,
            })
          );
          toast.success(`${res.email} ${res.message}`, { id: notification });
          router.push("/");
        } else {
          dispatch(
            login({
              username: res.name,
              email: res.email,
              id: res.id,
              token: res.token,
              admin: false,
            })
          );
          toast.success(`${res.email} ${res.message}`, { id: notification });
          router.push("/");
        }
      }
      if (res.message === "Wrong Password!!!") {
        setPasswordError(res.message);
        toast.error(`${res.email} ${res.message}`, { id: notification });
      }
      if (res.message === "User Not Exist") {
        setEmailError(res.message);
        toast.error(`${res.email} ${res.message}`, { id: notification });
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
        <h1 className="text-4xl">Sign In</h1>
        <div className={`mt-10`}>
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
            onClick={signIn}
            type="submit"
            className={`bg-[#008080] bg-gradient-to-r from-[#06202A]  text-white w-full rounded h-10 lg:h-8 font-bold hover:shadow-xl ${
              isInvalid && "opacity-50 "
            }`}
          >
            Sign in
          </button>
        </div>
        <p className="text-sm font-medium">
          Dont Have Account ? Please{" "}
          <span onClick={navSIgnUp} className="hover:underline cursor-pointer">
            Sign Up
          </span>
        </p>
      </main>
    </div>
  );
}

export default Signin;
