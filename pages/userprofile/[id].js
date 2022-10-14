import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { fetchgeopostwithemail } from "../../utils/fetchposts";
import { fetuserprofile } from "../../utils/fetchuserinfo";
import { useSelector } from "react-redux";
import { selectDarkmode } from "../../features/darkmodeSlice";
import PostFeeds from "../../components/PostFeeds";
import UserProfileHeader from "../../components/UserProfileHeader";

function Index({ posts, userprofile }) {
  console.log(userprofile);
  const darkMode = useSelector(selectDarkmode);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "page-bg-dark text-white" : "bg-std text-black"
      }`}
    >
      <div>
        <UserProfileHeader
          name={userprofile.name}
          email={userprofile.email}
          rating={userprofile.rating}
          postCount={userprofile.postCount}
          averageRating={userprofile.averageRating}
        />
      </div>
      <main className="px-5 py-10 gap-8 sm:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex flex-wrap items-center justify-center">
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
      </main>
    </div>
  );
}

export default Index;
export const getServerSideProps = async (context) => {
  const email = context.query.id;
  const userprofile = await fetuserprofile(email);
  const posts = await fetchgeopostwithemail(email);

  return {
    props: { posts, userprofile },
  };
};
