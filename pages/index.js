import React, { useState, useRef } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
//fetching
import {
  fetchPostOrderByRating,
  fetchFoodPostOrderByRating,
  fetchPost,
} from "../utils/fetchposts";
//redux
import { selectDarkmode } from "../features/darkmodeSlice";
import { useSelector } from "react-redux";
//icons
import { RiHotelLine } from "react-icons/ri";
import { IoRestaurantOutline, IoCameraOutline } from "react-icons/io5";
import { MdOutlineTour } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
// components
const OptionCard = dynamic(() => import("../components/OptionCard"));
const PostFeeds = dynamic(() => import("../components/PostFeeds"), {
  ssr: true,
});
const Footer = dynamic(() => import("../components/Footer"), { ssr: false });

export default function Home({ posts, foodPost, latestPost }) {
  const topRef = useRef(null);
  const scrollbarRef = useRef(null);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState(null);
  const darkMode = useSelector(selectDarkmode);
  const [currentpage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const indexOfLastPost = currentpage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPost = posts?.slice(indexOfFirstPost, indexOfLastPost);

  const searchInfo = (e) => {
    e.preventDefault();
    if (!searchType) {
      router.push(`/search/${searchTerm}`);
    } else {
      router.push(`/search/${searchTerm}/${searchType}`);
    }
  };

  const handleChange = (value) => {
    setSearchType(value);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "page-bg-dark text-white" : "bg-std text-black"
      }`}
      ref={topRef}
    >
      <Head>
        <title>Zong Hong PhotoTravel Map</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-screen mx-auto p-4">
        <div className=" ">
          <div className="relative flex px-10 sm:px-20 text-2xl whitespace-nowrap space-x-10 sm:space-x-20 overflow-x-scroll scrollbar-hide">
            <OptionCard
              title="Hotel"
              Icon={RiHotelLine}
              onClick={() => handleChange("accommodation")}
              style={`w-6 h-6 cursor-pointer transition-all duration-500  ease-in-out text-cyan-400`}
              value="accommodation"
              searchType={searchType}
            />
            <OptionCard
              title="Restaurant"
              Icon={IoRestaurantOutline}
              onClick={() => handleChange("catering")}
              value="catering"
              style="w-6 h-6 cursor-pointer transition-all duration-500  ease-in-out text-yellow-400"
              searchType={searchType}
            />
            <OptionCard
              title="Visit"
              onClick={() => handleChange("tourism")}
              Icon={IoCameraOutline}
              style="w-6 h-6 cursor-pointer transition-all duration-500  ease-in-out text-emerald-400"
              searchType={searchType}
              value="tourism"
            />
            <OptionCard
              value="entertainment"
              title="Things to do"
              onClick={() => handleChange("entertainment")}
              Icon={MdOutlineTour}
              style="w-6 h-6 cursor-pointer transition-all duration-500  ease-in-out text-fuchsia-400"
              searchType={searchType}
            />
          </div>

          <form
            onSubmit={searchInfo}
            className="w-full flex flex-row items-center mt-5 mb-10"
          >
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Where To?"
              className="flex-1 px-4 py-2 rounded-lg shadow-md focus:shadow-xl  outline-none border-none text-black tracking-widest font-medium"
            />
            <button hidden onSubmit={searchInfo}></button>
            <AiOutlineSearch
              className="w-8 h-8 hover:text-cyan-500 cursor-pointer"
              onClick={searchInfo}
            />
          </form>
        </div>
        <div className="my-4 space-y-2">
          <h2 className="text-xl font-bold tracking-widest">
            You might like these
          </h2>
          <p className="text-sm tracking-wider">
            More things to do for your next trip
          </p>
          <div className=" p-2 lg:p-4 grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {currentPost?.map((post) => (
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
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-widest">
            Find Your Dream Food
          </h2>
          <div className=" p-2 lg:p-4 grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {foodPost?.slice(0, 4).map((post) => (
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
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-widest">The Latest Post</h2>
          <div className=" p-2 lg:p-4 grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {latestPost?.slice(0, 4).map((post) => (
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
        </div>
        <div></div>
      </main>
      <Footer />
    </div>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  const posts = await fetchPostOrderByRating();
  const foodPost = await fetchFoodPostOrderByRating();
  const latestPost = await fetchPost();

  return {
    props: {
      posts,
      foodPost,
      latestPost,
    },
  };
};
