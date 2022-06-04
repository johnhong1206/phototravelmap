import React, { useState, useRef } from "react";
import Head from "next/head";

import { useSelector } from "react-redux";
import { selectDarkmode } from "../features/darkmodeSlice";
import { sanityClient, urlFor } from "../sanity";
import Footer from "../components/Footer";
import PostFeeds from "../components/PostFeeds";
import { getUniqueValues } from "../utils/helper";
import Post from "../components/Post";

function Travel({ posts }) {
  //   console.log("post", posts);
  const topRef = useRef(null);
  const darkMode = useSelector(selectDarkmode);
  const [foodPost, setFoodPost] = useState(posts);
  const dataList = foodPost;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(foodPost);
  const otherOptionFilter = ["location", "categoriesTypes"];
  const [activeCategoType, setActiveCategoType] = useState(null);

  const foodTypes = foodPost ? getUniqueValues(foodPost, "categoryTags") : null;

  const handleChange = (value) => {
    setActiveCategoType(value);
    setSearchTerm(value);
    filterData(value);
  };

  const filterData = (value) => {
    const Value = value?.toLocaleUpperCase().trim();
    if (Value === "") setSearchResults(dataList);
    else {
      const filteredData = dataList.filter((item) => {
        return Object.keys(item).some((key) =>
          otherOptionFilter.includes(key)
            ? item[key]?.title?.toString().toLocaleUpperCase().includes(Value)
            : item[key]?.toString().toLocaleUpperCase().includes(Value)
        );
      });

      setSearchResults(filteredData);
    }
  };

  return (
    <div
      className={`${
        darkMode ? "page-bg-dark text-white" : "bg-std text-black"
      }`}
      ref={topRef}
    >
      <Head>
        <title>Zong Hong PhotoTravel Map || Recommended Food</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-screen mx-auto min-h-[90vh]">
        <input
          value={searchTerm}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search anything you need... (Live Search by Filter)"
          className={`bg-transparent font-bold tracking-widest bg-gradient-to-l  p-2 px-5 h-full w-full flex-grow rounded flex-shrink rounded-l-md focus:outline-none
          `}
          type="text"
        />
        <div className="flex flex-row items-center justify-center space-x-4 overflow-x-auto px-4 lg:grid grid-flow-row-dense lg:grid-cols-7 gap-3">
          {foodTypes?.map((value, idx) => (
            <div
              onClick={(e) => handleChange(value)}
              key={idx}
              className={`bg-gray-800 uppercase  opacity-70 tracking-widest m-1 cursor-pointer transition-all duration-500  ease-in-out text-white flex items-center justify-center rounded-full w-40 h-6 text-sm ${
                activeCategoType == value &&
                "opacity-100 shadow border border-cyan-600 shadow-cyan-500 scale-110 "
              }`}
            >
              {value}
            </div>
          ))}
        </div>

        <div className="p-2 lg:p-4 grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {searchResults?.map((post) => (
            <Post post={post} key={post?._id} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Travel;
export const getServerSideProps = async (context) => {
  const query = `*[_type == "post" && postType == 'public' && count((categories[]->slug.current)[@ in ['travel']]) > 0  ]{
    ...,
    publishedAt,
    categoryTags,
    categoriesTypes[]->{
        ...
      },
    mainImage,
    location->{
      title
    },
  }| order(_createdAt desc)`;
  const posts = await sanityClient.fetch(query);
  return {
    props: {
      posts,
    },
  };
};