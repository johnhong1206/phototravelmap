import React, { useState, useEffect } from "react";
import { AiOutlineFire, AiOutlineStar, AiOutlinePicture } from "react-icons/ai";
import Link from "next/link";
import { fetchgeopostwithemailrating } from "../utils/fetchposts";
import PostFeeds from "./PostFeeds";

function LeaderboardCard({
  key,
  id,
  name,
  email,
  averageRating,
  rating,
  postCount,
}) {
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

  return (
    <Link href={`/userprofile/${email}`}>
      <div
        key={key}
        className="text-white border cursor-pointer hover:shadow-xl hover:border-cyan-300 m-2 rounded-xl border-gray-200 p-10 flex flex-col items-center justify-center w-full"
      >
        <div className="mb-4">
          <h2 className="text-xl lg:text-3xl text-center font-bold tracking-wide">
            {name}
          </h2>
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
            posts
              ?.slice(0, 4)
              .map((post) => (
                <div className="w-full">
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
