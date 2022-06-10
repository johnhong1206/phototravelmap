import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { IoRestaurantOutline } from "react-icons/io5";
import { RiHotelLine } from "react-icons/ri";
import { MdOutlineTour, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FaRegGem, FaRegGrinBeam } from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";

import { sanityClient, urlFor } from "../../sanity";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getCenter } from "geolib";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, Popup } from "react-map-gl";
import { IoChevronUpOutline } from "react-icons/io5";
import Footer from "../../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { selectDarkmode } from "../../features/darkmodeSlice";
import { getUniqueValues } from "../../utils/helper";
import {
  selectPlaceInfo,
  getAreaInfo,
  removeInfo,
} from "../../features/placeinfoSlice";
import toast from "react-hot-toast";

const PostFeeds = dynamic(() => import("../../components/PostFeeds"));

function PlaceDetail({ posts, location }) {
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkmode);
  const placeInfo = useSelector(selectPlaceInfo);

  const topRef = useRef(null);
  const [areaInfo, setAreaInfo] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchLocationResult, setSearchLocationResult] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const excludeColumns = [];

  const router = useRouter();
  const coordinates = posts.map((result) => ({
    longitude: result?.location?.longitude,
    latitude: result?.location?.latitude,
  }));
  const [selectedLocation, setSelectedLocation] = useState({});
  const [locationDetails, setLocationDetails] = useState({});
  const center = getCenter(coordinates);
  const [viewport, setViewport] = useState({
    longitude: center?.longitude,
    latitude: center?.latitude,
    zoom: 14,
    width: "100%",
    height: "100%",
  });
  const [currentpage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const [activeNumber, setActiveNumber] = useState("");
  const indexOfLastPost = currentpage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPost = posts?.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(posts?.length / postsPerPage); i++) {
    pageNumber.push(i);
  }

  const scrollToTop = () => {
    topRef.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  const getInfo = async () => {
    const refresnToast = toast.loading(
      `Getting ${location[0]?.title} area info`
    );

    const checkValue = location[0]?.city.toLocaleUpperCase();
    // console.log("checkValue: ", checkValue);
    const infoExist = placeInfo?.features?.find((item) =>
      item?.properties.city?.toLocaleUpperCase().includes(checkValue)
    );
    // console.log("infoExist: ", !!infoExist);

    // if (!!infoExist == true) {
    //   toast.error(`You already have  ${location[0]?.title} area info`, {
    //     id: refresnToast,
    //   });
    //   return false;
    // }

    // if (!!infoExist == false) {
    //   var requestOptions = {
    //     method: "GET",
    //   };
    //   const url = `https://api.geoapify.com/v2/places?categories=catering,tourism,heritage,accommodation,entertainment&filter=circle:${location[0].longitude},${location[0].latitude},10000&bias=proximity:${location[0].longitude},${location[0].latitude}&limit=30&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`;
    //   await fetch(url, requestOptions)
    //     .then((response) => response.json())
    //     .then((responseData) => {
    //       setAreaInfo(responseData);
    //       dispatch(getAreaInfo(responseData));
    //       toast.success(
    //         `${location[0]?.title} area info updated successfully`,
    //         {
    //           id: refresnToast,
    //         }
    //       );
    //     })
    //     .catch((error) => console.log("error", error));
    // }

    var requestOptions = {
      method: "GET",
    };
    const url = `https://api.geoapify.com/v2/places?categories=catering,tourism,heritage,accommodation,entertainment&filter=circle:${location[0].longitude},${location[0].latitude},10000&bias=proximity:${location[0].longitude},${location[0].latitude}&limit=30&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`;
    await fetch(url, requestOptions)
      .then((response) => response.json())
      .then((responseData) => {
        setAreaInfo(responseData);
        dispatch(getAreaInfo(responseData));
        toast.success(`${location[0]?.title} area info updated successfully`, {
          id: refresnToast,
        });
      })
      .catch((error) => console.log("error", error));
  };

  // useEffect(() => {
  //   if (location) {
  //     getInfo();
  //   }
  // }, [location]);

  const handleChange = (value) => {
    setSearchLocation(value);
    filterData(value);
  };
  const filterData = (value) => {
    const Value = value.toLocaleUpperCase().trim();
    if (Value === "") {
      setSearchLocationResult(placeInfo);
      setShowResults(false);
    } else {
      setShowResults(true);
      const newFilter = placeInfo?.features?.filter((item) =>
        item?.properties?.categories.includes(value)
      );
      setSearchLocationResult(newFilter);
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
        <title>Zong Hong PhotoTravel Map || {location[0]?.title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center justify-center space-x-2">
        <h1 className="text-center text-3xl lg:text-5xl uppercase">
          {location[0]?.title}
        </h1>
      </div>

      <main className="max-w-screen mx-auto">
        <div className="grid grid-flow-row-dense grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3 xl:grid-cols-4">
          {currentPost?.map((post) => (
            <PostFeeds
              key={post._id}
              title={post.title}
              author={post.author}
              slug={post.slug}
              mainImage={post.mainImage}
              categories={post.categories}
              publishedAt={post.publishedAt}
              location={post.location}
              body={post.body}
            />
          ))}
        </div>
        <div className="flex flex-row items-center justify-center space-x-10 my-2">
          {pageNumber?.map((number) => (
            <div
              onClick={() => {
                paginate(number);
                setActiveNumber(number);
              }}
              key={number}
              className={`grid place-items-center transition-all duration-500 ease-in-out cursor-pointer hover:animate-pulse bg-gray-900 bg-opacity-50 w-6 h-6 leading-6  text-white rounded-full 
              ${activeNumber == number && " bg-opacity-100 scale-125"}
           `}
            >
              <a className="tracking-widest text-sm">{number}</a>
            </div>
          ))}
        </div>
        <div className="my-4">
          <h2 className="text-3xl font-bold text-center">My Map</h2>
        </div>
        <div id="#map" className="relative flex items-center justify-center">
          {locationDetails?.name?.length > 0 ? (
            <div
              className={`${
                locationDetails ? "flex flex-col" : "hidden"
              } rounded-lg absolute p-4 top-2 left-2 z-50  lg:top-10 lg:left-10 bg-white shadow-md w-3/4 lg:w-1/4 h-fit  text-black`}
            >
              <h1 className="text-center font-bold mb-2 text-xl">
                {locationDetails?.name}
              </h1>
              <div className="grid grid-flow-row-dense  md:grid-cols-2 gap-2">
                {locationDetails?.categories?.map((item, idx) => (
                  <div key={idx} className="">
                    <p>{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <p className="font-light">
                  Distance: {locationDetails?.distance / 1000}
                  <span className="font-bold ml-1">KM</span>
                </p>
              </div>
              <div className="mt-2">
                <h2 className="text-center font-semibold mb-2 text-lg">
                  Address
                </h2>
                <p>{locationDetails?.formatted}</p>
              </div>
              <button
                onClick={() => setLocationDetails({})}
                className="bg-cyan-800 text-white font-bold px-3 py-1 w-full mt-2 rounded-xl hover:shadow-xl hover:shadow-cyan-500/20"
              >
                Close
              </button>
            </div>
          ) : (
            false
          )}
          <div className="absolute z-50 top-10 right-4 flex items-center justify-center space-x-4">
            <IoRestaurantOutline
              className={`w-5 h-5 cursor-pointer transition-all duration-500 ease-in-out text-yellow-400 ${
                searchLocation === "catering" && "scale-150"
              }`}
              onClick={() => handleChange("catering")}
            />
            <RiHotelLine
              className={`w-5 h-5 transition-all duration-500 ease-in-out text-cyan-400 ${
                searchLocation === "accommodation" && "scale-150"
              }`}
              onClick={() => handleChange("accommodation")}
            />
            <MdOutlineTour
              className={`w-5 h-5 transition-all duration-500 ease-in-out text-fuchsia-400 ${
                searchLocation === "tourism" && "scale-150"
              }`}
              onClick={() => handleChange("tourism")}
            />
            <FaRegGem
              className={`w-5 h-5 transition-all duration-500 ease-in-out text-red-400 ${
                searchLocation === "heritage" && "scale-150"
              } `}
              onClick={() => handleChange("heritage")}
            />
            <FaRegGrinBeam
              className={`w-5 h-5 transition-all duration-500 ease-in-out text-purple-400 ${
                searchLocation === "entertainment" && "scale-150"
              }`}
              onClick={() => handleChange("entertainment")}
            />
            <BiRefresh
              onClick={getInfo}
              className=" text-blue-500 h-6 w-6 cursor-pointer text-twitterBlue transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
            />
            {showResults ? (
              <MdChevronLeft
                onClick={() => setShowResults(!showResults)}
                className="w-6 h-6"
              />
            ) : (
              <MdChevronRight
                onClick={() => setShowResults(!showResults)}
                className="w-6 h-6"
              />
            )}
          </div>
          <Map
            {...viewport}
            onMove={(evt) => setViewport(evt.viewport)}
            style={{ width: "100vw", height: "90vh" }}
            mapStyle="mapbox://styles/zonghong/cks1a85to4kqf18p6zuj5zdx6"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
          >
            {posts.map((post) => (
              <div key={post._id}>
                {post?.mainImage && (
                  <Marker
                    longitude={Number(post.location.longitude)}
                    latitude={Number(post.location.latitude)}
                    color="red"
                    onClick={() => setSelectedLocation(post)}
                  >
                    <div
                      onClick={() =>
                        setSelectedLocation(post.location.longitude)
                      }
                      className="w-12 text-center  text-white  cursor-pointer"
                    >
                      <Image
                        layout="fixed"
                        width={60}
                        height={60}
                        src={urlFor(post.mainImage).url()}
                        alt="img"
                        objectFit="contain"
                        className=""
                      />
                    </div>
                  </Marker>
                )}

                {selectedLocation === post.location.longitude ? (
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
            {showResults ? (
              <>
                {searchLocationResult?.map((result, idx) => (
                  <div key={idx} className="">
                    <Marker
                      longitude={Number(result?.properties?.lon)}
                      latitude={Number(result?.properties?.lat)}
                      color="red"
                      onClick={() =>
                        setSelectedLocation(result?.properties?.lon)
                      }
                    >
                      <div className="flex flex-row items-center justify-center space-x-1 px-2 py-1 bg-gray-800 w-full rounded-full">
                        <h2>{result?.properties?.name}</h2>
                        <div className="grid grid-flow-row-dense grid-cols-2">
                          {result?.properties?.categories.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-center"
                            >
                              {item == "catering" && (
                                <IoRestaurantOutline
                                  className="w-4 h-4 transition-all duration-500 ease-out text-yellow-400"
                                  onClick={() => setSelectedLocation(result)}
                                />
                              )}
                              {item == "accommodation" && (
                                <RiHotelLine
                                  className="w-4 h-4 text-cyan-400"
                                  onClick={() => setSelectedLocation(result)}
                                />
                              )}
                              {item == "tourism" && (
                                <MdOutlineTour
                                  className="w-4 h-4 text-fuchsia-400"
                                  onClick={() => setSelectedLocation(result)}
                                />
                              )}
                              {item == "leisure" && (
                                <MdOutlineTour
                                  className="w-4 h-4 text-pink-400"
                                  onClick={() => setSelectedLocation(result)}
                                />
                              )}
                              {item == "heritage" && (
                                <FaRegGem
                                  className="w-4 h-4 text-red-400"
                                  onClick={() => setSelectedLocation(result)}
                                />
                              )}
                              {item == "entertainment" && (
                                <FaRegGrinBeam
                                  className="w-4 h-4 text-purple-400"
                                  onClick={() => setSelectedLocation(result)}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </Marker>
                    {selectedLocation === result?.properties?.lon ? (
                      <div>
                        <Popup
                          closeOnClick={false}
                          onClose={() => setSelectedLocation({})}
                          latitude={result?.properties?.lat}
                          longitude={result?.properties?.lon}
                        >
                          <div
                            onClick={() =>
                              setLocationDetails(result?.properties)
                            }
                            className="cursor-pointer"
                          >
                            <p className="font-bold hover:underline text-black">
                              {result?.properties?.name}
                            </p>
                          </div>
                        </Popup>
                      </div>
                    ) : (
                      false
                    )}
                  </div>
                ))}
              </>
            ) : (
              <>
                {placeInfo?.features?.map((result, idx) => (
                  <div key={idx} className="">
                    <Marker
                      longitude={Number(result?.properties?.lon)}
                      latitude={Number(result?.properties?.lat)}
                      color="red"
                      onClick={() =>
                        setSelectedLocation(result?.properties?.lon)
                      }
                    >
                      <div className="flex flex-row items-center justify-center space-x-1 px-2 py-1 bg-gray-800 w-full rounded-full">
                        <h2>{result?.properties?.name}</h2>
                        <div className="grid grid-flow-row-dense grid-cols-2">
                          {result?.properties?.categories.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-center"
                            >
                              {item == "catering" && (
                                <IoRestaurantOutline
                                  className="w-4 h-4 text-yellow-400"
                                  onClick={() => setSelectedLocation(result)}
                                />
                              )}
                              {item == "accommodation" && (
                                <RiHotelLine
                                  className="w-4 h-4 text-cyan-400"
                                  onClick={() => setSelectedLocation(result)}
                                />
                              )}
                              {item == "tourism" && (
                                <MdOutlineTour
                                  className="w-4 h-4 text-fuchsia-400"
                                  onClick={() => setSelectedLocation(result)}
                                />
                              )}
                              {item == "leisure" && (
                                <MdOutlineTour
                                  className="w-4 h-4 text-fuchsia-400"
                                  onClick={() => setSelectedLocation(result)}
                                />
                              )}
                              {item == "heritage" && (
                                <FaRegGem
                                  className="w-4 h-4 text-red-400"
                                  onClick={() => setSelectedLocation(result)}
                                />
                              )}
                              {item == "entertainment" && (
                                <FaRegGrinBeam
                                  className="w-4 h-4 text-purple-400"
                                  onClick={() => setSelectedLocation(result)}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </Marker>
                    {selectedLocation === result?.properties?.lon ? (
                      <div>
                        <Popup
                          closeOnClick={false}
                          onClose={() => setSelectedLocation({})}
                          latitude={result?.properties?.lat}
                          longitude={result?.properties?.lon}
                        >
                          <div
                            onClick={() =>
                              setLocationDetails(result?.properties)
                            }
                            className="cursor-pointer"
                          >
                            <p className="font-bold hover:underline text-black">
                              {result?.properties?.name}
                            </p>
                          </div>
                        </Popup>
                      </div>
                    ) : (
                      false
                    )}
                  </div>
                ))}
              </>
            )}
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

export default PlaceDetail;
export const getServerSideProps = async (context) => {
  const id = context.query.id;

  const locationquery = `*[_type == "location" && _id == $id ]{
    ...
   }`;

  const query = `*[_type == "post" && location._ref == $id ]{
    _id,
    title,
    author->{
      _id,
      ...,
    },
    slug,
    publishedAt,
    categories[0]->{
      _id,
      ...,
    },
    mainImage,
    location->{
      _id,
      ...,
    },
  }| order(_createdAt desc)`;

  const posts = await sanityClient.fetch(query, { id: id });
  const location = await sanityClient.fetch(locationquery, { id: id });

  return {
    props: {
      posts,
      location,
    },
  };
};
