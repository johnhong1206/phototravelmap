import React from "react";
import PostFeeds from "./PostFeeds";
import UserProfileHeader from "./UserProfileHeader";
import { AiOutlinePicture, AiOutlineCamera } from "react-icons/ai";

function UserProfilePost({ posts, userprofile, phase, setPhase }) {
  return (
    <div className="grid grid-flow-row-dense grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3 xl:grid-cols-4">
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
