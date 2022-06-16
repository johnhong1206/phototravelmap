import React, { useState, useRef } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { sanityClient } from "../sanity";
import { getUniqueValues } from "../utils/helper";
import { useSelector } from "react-redux";
import { selectDarkmode } from "../features/darkmodeSlice";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
const Post = dynamic(() => import("../components/Post"));
const Footer = dynamic(() => import("../components/Footer"));

function Food({ posts }) {
  const topRef = useRef(null);
  const scrollbarRef = useRef(null);
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
  const scroll = (scrollOffset) => {
    scrollbarRef.current.scrollLeft += scrollOffset;
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
        <div className="flex flex-row items-center mb-4 w-full px-2">
          <AiOutlineLeft
            onClick={() => scroll(-200)}
            className="w-5 h-5 cursor-pointer text-cyan-400"
          />

          <div
            ref={scrollbarRef}
            className="scroll-smooth flex items-center justify-between space-x-12 w-full overflow-x-scroll scrollbar-hide mx-4"
          >
            <div
              onClick={(e) => handleChange("")}
              className={`bg-gray-800 flex-1 w-full cursor-pointer transition-all duration-500  ease-in-out text-white flex items-center justify-center rounded-full text-sm 
                `}
            >
              <p className="uppercase tracking-widest mx-4 my-1 ">All</p>
            </div>
            {foodTypes?.map((value, idx) => (
              <div
                onClick={(e) => handleChange(value)}
                key={idx}
                className={`bg-gray-800 flex-1 w-full cursor-pointer transition-all duration-500  ease-in-out text-white flex items-center justify-center rounded-full text-sm ${
                  activeCategoType == value &&
                  "scale-125 shadow-2xl shadow-cyan-100 animate-pulse text-fuchsia-400"
                }`}
              >
                <p className="uppercase tracking-widest mx-4 my-1 ">{value}</p>
              </div>
            ))}
          </div>
          <AiOutlineRight
            onClick={() => scroll(200)}
            className="w-5 h-5 cursor-pointer text-cyan-400"
          />
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

export default Food;
export const getServerSideProps = async (context) => {
  const query = `*[_type == "post" && postType == 'public' && count((categories[]->slug.current)[@ in ['food']]) > 0  ]{
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
