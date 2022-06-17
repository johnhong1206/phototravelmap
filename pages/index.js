import React, { useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { urlFor } from "../sanity";
import { fetchPost } from "../utils/fetchposts";
import { selectDarkmode } from "../features/darkmodeSlice";
import { useSelector } from "react-redux";
import Map, { Marker, Popup } from "react-map-gl";
import { getCenter } from "geolib";
import "mapbox-gl/dist/mapbox-gl.css";
import { IoChevronUpOutline } from "react-icons/io5";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
const PostFeeds = dynamic(() => import("../components/PostFeeds"));
const Footer = dynamic(() => import("../components/Footer"), { ssr: false });

export default function Home({ posts }) {
  const topRef = useRef(null);
  const scrollbarRef = useRef(null);

  const router = useRouter();

  const darkMode = useSelector(selectDarkmode);
  const [showAll, setShowAll] = useState(false);
  const [currentpage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const [activeNumber, setActiveNumber] = useState("");
  const indexOfLastPost = currentpage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPost = posts?.slice(indexOfFirstPost, indexOfLastPost);
  const mapImgPost = showAll ? posts : currentPost;
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(posts?.length / postsPerPage); i++) {
    pageNumber.push(i);
  }
  const coordinates = posts.map((result) => ({
    longitude: result?.location?.longitude,
    latitude: result?.location?.latitude,
  }));

  const [selectedLocation, setSelectedLocation] = useState({});
  const center = getCenter(coordinates);
  const [viewport, setViewport] = useState({
    longitude: center?.longitude,
    latitude: center?.latitude,
    zoom: 3.5,
    width: "100%",
    height: "100%",
  });

  const scrollToTop = () => {
    topRef.current.scrollIntoView({
      behavior: "smooth",
    });
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
        <title>Zong Hong PhotoTravel Map</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-screen mx-auto">
        <div className="w-full mb-48">
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
                  />
                )}
              </>
            ))}
          </div>
          <div className="flex flex-row items-center justify-between  mb-4 w-full px-2">
            <AiOutlineLeft
              onClick={() => scroll(-200)}
              className="w-5 h-5 cursor-pointer text-cyan-400"
            />
            <div
              ref={scrollbarRef}
              className="scroll-smooth h-12 flex flex-row items-center justify-between lg:justify-center space-x-4 lg:space-x-4 w-full overflow-x-scroll scrollbar-hide"
            >
              {pageNumber.map((number) => (
                <div
                  onClick={() => paginate(number)}
                  key={number}
                  className={`w-6  h-6 flex items-center justify-center transition-all duration-500 ease-in-out cursor-pointer hover:animate-pulse  bg-opacity-50 text-white rounded-full 
                ${darkMode ? "bg-gray-300 text-blue-700" : "bg-gray-900"}
                ${currentpage == number && "bg-opacity-100 scale-125"}
             `}
                >
                  <a className="tracking-widest text-sm m-4">{number}</a>
                </div>
              ))}
            </div>
            <AiOutlineRight
              onClick={() => scroll(200)}
              className="w-5 h-5 cursor-pointer text-cyan-400"
            />
          </div>
        </div>
        <div className="my-4">
          <h2 className="text-3xl font-bold text-center">My Map</h2>
        </div>
        <div id="#map" className="relative flex items-center justify-center">
          <div className=" transition-all duration-700 ease-in-out z-50 absolute top-5 right-5 flex flex-row items-center justify-center space-x-2 my-2">
            <div className="flex flex-row items-center justify-between  mb-4 w-full px-2">
              <AiOutlineLeft
                onClick={() => scroll(-200)}
                className="w-5 h-5 cursor-pointer text-cyan-400"
              />
              <div
                ref={scrollbarRef}
                className="scroll-smooth h-12 flex flex-row items-center justify-between lg:justify-center space-x-4 lg:space-x-4 w-full overflow-x-scroll scrollbar-hide"
              >
                {pageNumber.map((number) => (
                  <div
                    key={number}
                    className={`w-6  h-6 flex items-center justify-center transition-all duration-500 ease-in-out cursor-pointer hover:animate-pulse  bg-opacity-50 text-white rounded-full 
                ${darkMode ? "bg-gray-300 text-blue-700" : "bg-gray-900"}
                ${currentpage == number && "bg-opacity-100 scale-125"}
             `}
                  >
                    <a
                      onClick={() => paginate(number)}
                      className="tracking-widest text-sm m-4"
                    >
                      {number}
                    </a>
                  </div>
                ))}
              </div>
              <AiOutlineRight
                onClick={() => scroll(200)}
                className="w-5 h-5 cursor-pointer text-cyan-400"
              />
            </div>
            {showAll ? (
              <>
                <div
                  className={`flex items-center justify-center transition-all duration-700 ease-in-out cursor-pointer hover:animate-pulse  bg-opacity-50 w-6 h-6 leading-6  text-white rounded-full 
              ${darkMode ? "bg-gray-700 text-blue-400" : "bg-gray-900"}
              
           `}
                >
                  <MdChevronLeft
                    onClick={() => setShowAll(!showAll)}
                    className="w-6 h-6"
                  />
                </div>
              </>
            ) : (
              <>
                <div
                  className={`flex items-center justify-center transition-all duration-700 ease-in-out cursor-pointer hover:animate-pulse  bg-opacity-50 w-6 h-6 leading-6  text-white rounded-full 
              ${darkMode ? "bg-gray-700 text-blue-400" : "bg-gray-900"}
              
           `}
                >
                  <MdChevronRight
                    onClick={() => setShowAll(!showAll)}
                    className="w-6 h-6"
                  />
                </div>
              </>
            )}
          </div>
          <Map
            {...viewport}
            onMove={(evt) => setViewport(evt.viewport)}
            style={{ width: "100vw", height: "100vh" }}
            mapStyle="mapbox://styles/zonghong/cks1a85to4kqf18p6zuj5zdx6"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
          >
            {mapImgPost?.map((post) => (
              <div key={post._id}>
                <Marker
                  longitude={Number(post.location.longitude)}
                  latitude={Number(post.location.latitude)}
                  color="red"
                  onClick={() => setSelectedLocation(post)}
                >
                  <div
                    onClick={() => setSelectedLocation(post.location.longitude)}
                    className="w-12 text-center  text-white  cursor-pointer"
                  >
                    {post?.mainImage && (
                      <Image
                        layout="fixed"
                        width={60}
                        height={60}
                        src={urlFor(post?.mainImage)?.url()}
                        alt="img"
                        objectFit="contain"
                        className=""
                      />
                    )}
                  </div>
                </Marker>
                {selectedLocation === post?.location?.longitude ? (
                  <div>
                    <Popup
                      closeOnClick={false}
                      onClose={() => setSelectedLocation({})}
                      latitude={post.location.latitude}
                      longitude={post.location.longitude}
                    >
                      <div
                        onClick={() =>
                          router.push(`/post/${post.slug.current}`)
                        }
                        className="cursor-pointer"
                      >
                        <p className="font-bold hover:underline">
                          {post.title}
                        </p>
                      </div>
                    </Popup>
                  </div>
                ) : (
                  false
                )}
              </div>
            ))}
          </Map>
          <div
            onClick={scrollToTop}
            className="w-12 h-12 bg-green-500 group hover:bg-green-700 flex items-center justify-center rounded-full absolute -bottom-4 bg-opacity-30 cursor-pointer "
          >
            <IoChevronUpOutline className="w-6 h-6 text-white hover:text-green-100" />
          </div>
        </div>
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
  const posts = await fetchPost();

  return {
    props: {
      posts,
    },
  };
};
