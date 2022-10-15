import React, { useState, useEffect } from "react";
import { sanityClient } from "../../sanity";
import Link from "next/link";
import { useRouter } from "next/router";

import { fetchgeopostwithemail } from "../../utils/fetchposts";
import { fetuserprofile } from "../../utils/fetchuserinfo";
import { useSelector } from "react-redux";
import { selectDarkmode } from "../../features/darkmodeSlice";
import PostFeeds from "../../components/PostFeeds";
import UserProfileHeader from "../../components/UserProfileHeader";
import { AiOutlinePicture, AiOutlineCamera } from "react-icons/ai";
import UserProfilePost from "../../components/UserProfilePost";
import UserProfilePostImage from "../../components/UserProfilePostImage";
import { fetchlocation } from "../../utils/fetchlocation";
import { selectUser } from "../../features/userSlice";

function Index({ posts, userprofile, location, categories }) {
  const darkMode = useSelector(selectDarkmode);
  const user = useSelector(selectUser);
  const router = useRouter();

  const [phase, setPhase] = useState("photo");
  const [authorPost, setAuthorPost] = useState(posts);
  const [authorPostCount, setAuthorPostCount] = useState(posts?.length);
  const [userRating, setUserRating] = useState(null);
  const [userAverageRating, setUserAverageRating] = useState(null);
  const userId = user?.id;

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
        className={`flex flex-col items-center cursor-pointer justify-center`}
      >
        <div
          className={`my-2 flex flex-col space-y-2 items-center justify-center `}
        >
          {name === "photo" && (
            <AiOutlinePicture
              className={`w-6 h-6 ${
                phase === "photo" ? "text-emerald-400" : "text-gray-400"
              }`}
            />
          )}
          {name === "upload" && (
            <AiOutlineCamera
              className={`w-6 h-6  ${
                phase === "upload" ? "text-rose-400" : "text-gray-400"
              }`}
            />
          )}

          <h1
            className={`font-semibold uppercase text-center ${
              isActive
                ? `${darkMode ? "text-white" : "text-blue-500"}`
                : "text-gray-400"
            }`}
          >
            {name}
          </h1>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "page-bg-dark text-white" : "bg-std text-black"
      }`}
    >
      <div className="h-full w-full">
        <div>
          <UserProfileHeader
            name={userprofile.name}
            email={userprofile.email}
            rating={userprofile.rating}
            postCount={userprofile.postCount}
            averageRating={userprofile.averageRating}
          />
        </div>
        {user?.email == router.query.id && (
          <div className="flex items-center justify-center w-full space-x-8 py-3">
            <Phase
              setPhase={setPhase}
              name="photo"
              isActive={phase == "Post" ? true : false}
            />
            <Phase
              setPhase={setPhase}
              name="upload"
              isActive={phase == "Post" ? true : false}
            />
          </div>
        )}

        {phase === "photo" && (
          <UserProfilePost
            posts={posts}
            userprofile={userprofile}
            phase={phase}
            setPhase={setPhase}
          />
        )}
        {phase === "upload" && (
          <UserProfilePostImage
            posts={posts}
            userprofile={userprofile}
            location={location}
            categories={categories}
            authorPostCount={authorPostCount}
            userRating={userRating}
            userAverageRating={userAverageRating}
            userId={userId}
          />
        )}
      </div>
    </div>
  );
}

export default Index;
export const getServerSideProps = async (context) => {
  const categoriesquery = `*[_type == "category"]{
    ...
   }| order(_createdAt desc)`;

  const email = context.query.id;
  const userprofile = await fetuserprofile(email);
  const posts = await fetchgeopostwithemail(email);
  const location = await fetchlocation();
  const categories = await sanityClient.fetch(categoriesquery);

  return {
    props: {
      posts,
      userprofile,
      location,
      categories: categories,
    },
  };
};
