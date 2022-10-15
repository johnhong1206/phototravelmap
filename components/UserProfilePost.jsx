import React from "react";
import PostFeeds from "./PostFeeds";
import UserProfileHeader from "./UserProfileHeader";
import { AiOutlinePicture, AiOutlineCamera } from "react-icons/ai";

function UserProfilePost({ posts, userprofile, phase, setPhase }) {
  return (
    <div className="px-1 lg:px-4 py-1 gap-4 grid md:grid-cols-2 xl:grid-cols-3 3xl:flex flex-wrap items-center justify-center w-full">
      {posts?.map((post) => (
        <>
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
        </>
      ))}
    </div>
  );
}

export default UserProfilePost;
