import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { sanityClient } from "../sanity";
import { fetchPost, fetchgeopostwithemail } from "../utils/fetchposts";
import { fetchlocation } from "../utils/fetchlocation";
import { useSelector } from "react-redux";
import {
  selectCategoryModalIsOpen,
  selectLocationModalIsOpen,
} from "../features/modalSlice";
import { selectDarkmode } from "../features/darkmodeSlice";
import { selectUser } from "../features/userSlice";
import { BiRefresh } from "react-icons/bi";
const AddLocationModal = dynamic(() =>
  import("../components/AddLocationModal")
);
const AddCategoryModal = dynamic(() =>
  import("../components/AddCategoryModal")
);
const AddPost = dynamic(() => import("../components/AddPost"));
const AdminPostList = dynamic(() => import("../components/AdminPostList"));
const AddPostCategories = dynamic(() =>
  import("../components/AddPostCategories")
);
const AddImagetoPost = dynamic(() => import("../components/AddImagetoPost"));
const AddPostCategoriesTypes = dynamic(() =>
  import("../components/AddPostCategoriesTypes")
);

import toast from "react-hot-toast";

function Admin({ location, categories, posts }) {
  const darkMode = useSelector(selectDarkmode);
  const user = useSelector(selectUser);

  const [phase, setPhase] = useState("Post");
  const [selectPost, setSelectPost] = useState(null);
  const [refetchpost, setRefetchPost] = useState(posts);
  const [refetchLocation, setRefetchLocation] = useState(location);
  const locationModalisOpen = useSelector(selectLocationModalIsOpen);
  const categoryModalisOpen = useSelector(selectCategoryModalIsOpen);
  const [authorPost, setAuthorPost] = useState([]);
  const [authorPostCount, setAuthorPostCount] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [userAverageRating, setUserAverageRating] = useState(null);
  const userId = user?.id;

  useEffect(() => {
    if (user) {
      const getuserPost = async () => {
        const email = user?.email;
        const newdata = await fetchgeopostwithemail(email);
        setAuthorPost(newdata);
      };
      getuserPost();
    }
  }, [user]);

  useEffect(() => {
    const postCount = authorPost?.length;
    const currentRating = authorPost?.reduce(
      (total, item) => (total += item.rating),
      0
    );
    const rating = Number(currentRating) / Number(postCount);
    setUserRating(Number(currentRating));
    setAuthorPostCount(postCount);
    setUserAverageRating(rating);
  }, [authorPost]);

  const Phase = ({ name, isActive, setPhase }) => {
    return (
      <div
        onClick={() => setPhase(name)}
        className={`flex flex-col items-center cursor-pointer`}
      >
        <h1
          className={`font-bold text-center ${
            isActive
              ? `${darkMode ? "text-white" : "text-blue-500"}`
              : "text-gray-400"
          }`}
        >
          {name}
        </h1>
        <div
          className={`w-4 h-4 rounded-full ${
            isActive ? "bg-blue-600" : "bg-gray-400"
          }`}
        />
      </div>
    );
  };

  const handleRefresh = async () => {
    const refresnToast = toast.loading("Refreshing Post...");
    await fetchPost().then((posts) => {
      setRefetchPost(posts);
    });

    toast.success("Feeds Updated", { id: refresnToast });
  };

  const refreshAllLocation = async () => {
    const refresnToast = toast.loading("Refreshing Location...");

    await fetchlocation().then((location) => {
      setRefetchLocation(location);
    });

    toast.success("Location Updated", { id: refresnToast });
  };

  const refeshAll = () => {
    handleRefresh();
    refreshAllLocation();
  };

  // if (!user?.admin)
  //   return (
  //     <div
  //       className={`flex flex-col items-center justify-center h-[93vh]  ${
  //         darkMode ? "page-bg-dark text-white" : "bg-std text-black"
  //       }`}
  //     >
  //       <h1 className="text-3xl font-bold mb-8">You are not Admin</h1>
  //       <Link href="/">
  //         <p className="cursor-pointer hover:underline">
  //           Click here to Home Page
  //         </p>
  //       </Link>
  //     </div>
  //   );

  return (
    <div
      className={`flex flex-col h-screen overflow-y-scroll scrollbar-hide ${
        darkMode ? "page-bg-dark text-white" : "bg-std text-black"
      }`}
    >
      <Head>
        <title>Zong Hong PhotoTravel Map Admin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid gap-3 grid-flow-row-dense grid-cols-3 lg:grid-cols-5 mt-1 mb-5">
        <Phase
          setPhase={setPhase}
          name="Post"
          isActive={phase == "Post" ? true : false}
        />
        <Phase
          setPhase={setPhase}
          name="Add Post"
          isActive={phase == "Add Post" ? true : false}
        />
        <Phase
          setPhase={setPhase}
          name="Add Image"
          isActive={phase == "Add Image" ? true : false}
        />
        <Phase
          setPhase={setPhase}
          name="Add Category"
          isActive={phase == "Add Category" ? true : false}
        />
        <Phase
          setPhase={setPhase}
          name="Add Category Types"
          isActive={phase == "Add Category Types" ? true : false}
        />
        <div className="flex flex-col items-center justify-center cursor-pointer">
          <h1 className={`font-bold hover:text-blue-300`}>Refresh</h1>
          <BiRefresh
            onClick={refeshAll}
            className=" text-blue-500 h-6 w-6 cursor-pointer text-twitterBlue transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
          />
        </div>
      </div>
      <main className="h-screen">
        {phase == "Post" && (
          <AdminPostList
            posts={refetchpost}
            setSelectPost={setSelectPost}
            selectPost={selectPost}
          />
        )}
        {phase == "Add Post" && (
          <AddPost
            posts={refetchpost}
            location={refetchLocation}
            categories={categories}
            handleRefresh={refeshAll}
            setPhase={setPhase}
            authorPostCount={authorPostCount}
            userRating={userRating}
            userAverageRating={userAverageRating}
            userId={userId}
          />
        )}
        {phase == "Add Image" && (
          <AddImagetoPost
            selectPost={selectPost}
            setPhase={setPhase}
            handleRefresh={refeshAll}
            setSelectPost={setSelectPost}
          />
        )}
        {phase == "Add Category" && (
          <AddPostCategories
            setPhase={setPhase}
            selectPost={selectPost}
            categories={categories}
            handleRefresh={refeshAll}
            setSelectPost={setSelectPost}
            posts={refetchpost}
          />
        )}
        {phase == "Add Category Types" && (
          <AddPostCategoriesTypes
            setPhase={setPhase}
            selectPost={selectPost}
            categories={categories}
            handleRefresh={refeshAll}
            setSelectPost={setSelectPost}
            posts={refetchpost}
          />
        )}
      </main>

      {locationModalisOpen && <AddLocationModal handleRefresh={refeshAll} />}
      {categoryModalisOpen && <AddCategoryModal />}
    </div>
  );
}
export default Admin;
export const getServerSideProps = async (context) => {
  const categoriesquery = `*[_type == "category"]{
        ...
       }| order(_createdAt desc)`;
  const posts = await fetchPost();
  const location = await fetchlocation();
  const categories = await sanityClient.fetch(categoriesquery);

  return {
    props: {
      posts,
      location,
      categories,
    },
  };
};
