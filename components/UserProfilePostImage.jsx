import React, { useState } from "react";
import { useRouter } from "next/router";
import { BiRefresh } from "react-icons/bi";
import { useSelector } from "react-redux";
import { selectDarkmode } from "../features/darkmodeSlice";
import { fetchgeopostwithemail } from "../utils/fetchposts";
import { fetchlocation } from "../utils/fetchlocation";

import AdminPostList from "./AdminPostList";
import toast from "react-hot-toast";
import AddPost from "./AddPost";
import AddImagetoPost from "./AddImagetoPost";
import AddPostCategories from "./AddPostCategories";
import AddPostCategoriesTypes from "./AddPostCategoriesTypes";

function UserProfilePostImage({
  posts,
  userprofile,
  location,
  categories,
  authorPostCount,
  userRating,
  userAverageRating,
  userId,
}) {
  console.log("categories", categories);
  const router = useRouter();
  const email = router.query.id;
  console.log(
    "authorPostCount",
    authorPostCount,
    "userRating",
    userRating,
    "userAverageRating",
    userAverageRating,
    userId
  );

  const darkMode = useSelector(selectDarkmode);

  const [phase, setPhase] = useState("Post");
  const [refetchpost, setRefetchPost] = useState(posts);
  const [selectPost, setSelectPost] = useState(null);
  const [refetchLocation, setRefetchLocation] = useState(location);

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
    await fetchgeopostwithemail(email).then((posts) => {
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

  return (
    <div>
      <div className="grid gap-3 grid-flow-row-dense grid-cols-3 lg:grid-cols-6 mt-1 mb-5">
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
      <div>
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
      </div>
    </div>
  );
}

export default UserProfilePostImage;
