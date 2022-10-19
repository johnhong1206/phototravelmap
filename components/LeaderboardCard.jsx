import React, { useState, useEffect } from "react";
import {
  AiOutlineFire,
  AiOutlineStar,
  AiOutlinePicture,
  AiOutlineCrown,
} from "react-icons/ai";
import Link from "next/link";
import { fetchgeopostwithemailrating } from "../utils/fetchposts";
import PostFeeds from "./PostFeeds";
import { useSelector } from "react-redux";
import { selectDarkmode } from "../features/darkmodeSlice";

function LeaderboardCard({
  key,
  idx,
  id,
  name,
  email,
  averageRating,
  rating,
  postCount,
}) {
  const darkMode = useSelector(selectDarkmode);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (email) {
      const getuserPost = async () => {
        const newdata = await fetchgeopostwithemailrating(email);
        setPosts(newdata);
        setLoading(false);
      };
      getuserPost();
    }
  }, [email]);

  const renderCrown = () => {
    if (idx === 0) {
      return <AiOutlineCrown className="w-6 h-6 text-[#FFD700]" />;
    }
    if (idx === 1) {
      return <AiOutlineCrown className="w-6 h-6 text-[#C0C0C0]" />;
    }
    if (idx === 2) {
      return <AiOutlineCrown className="w-6 h-6 text-[#CD7F32]" />;
    }
  };

  return (
    <Link href={`/userprofile/${email}`}>
      <div
        key={key}
        className={`border cursor-pointer hover:shadow-xl hover:border-cyan-300 m-2 rounded-xl border-gray-200 p-10 flex flex-col items-center justify-center w-full ${
          darkMode ? "text-white" : "text-gray-700"
        }`}
      >
        <div className="mb-4 flex items-center justify-center space-x-2">
          <h2 className="text-xl lg:text-3xl text-center font-bold tracking-wide">
            {name}
          </h2>
          {renderCrown()}
        </div>
        <div className="flex items-center justify-start space-x-8">
          <div className="flex items-center space-x-1">
            <p>{rating?.toFixed(2)}</p>
            <AiOutlineFire className="text-rose-400 w-5 h-5" />
          </div>
          <div className="flex items-center space-x-1">
            <p>{averageRating?.toFixed(2)}</p>
            <AiOutlineStar className="text-emerald-400 w-5 h-5" />
          </div>
          <div className="flex items-center space-x-1">
            <p>{postCount}</p>
            <AiOutlinePicture className="text-cyan-400 w-5 h-5" />
          </div>
        </div>
        <div className="w-full grid gap-3 mt-4 place-items-center md:grid-cols-2 lg:grid-cols-4">
          {!loading ? (
            posts?.slice(0, 4).map((post) => (
              <div key={post?._id} className="w-full">
                {post?.mainImage && (
                  <PostFeeds
                    id={post?._id}
                    key={post?._id}
                    title={post?.title}
                    author={post?.author}
                    slug={post?.slug}
                    mainImage={post?.mainImage}
                    categories={post?.categories}
                    publishedAt={post?.publishedAt}
                    location={post?.location}
                    body={post?.body}
                    rating={post?.rating}
                    noroute
                  />
                )}
              </div>
            ))
          ) : (
            <p>loading...</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default LeaderboardCard;
