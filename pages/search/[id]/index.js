import React, { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
// map
import Map, { Marker, Popup } from "react-map-gl";
import { getCenter } from "geolib";
import "mapbox-gl/dist/mapbox-gl.css";
// redux
import { useSelector } from "react-redux";
import { selectDarkmode } from "../../../features/darkmodeSlice";
// fetching
import {
  fetchgeoInfo,
  fetchAreageo,
  fetchCommonAreaInfo,
} from "../../../utils/fetchgeoinfo";
import { fetchgeopost } from "../../../utils/fetchposts";
// icins
import {
  IoRestaurantOutline,
  IoCloseOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import { RiHotelLine } from "react-icons/ri";

import { FaRegGem } from "react-icons/fa";
import { MdOutlineTour } from "react-icons/md";
const PostFeeds = dynamic(() => import("../../../components/PostFeeds"));
const Footer = dynamic(() => import("../../../components/Footer"));

function Index({ type, areaGeo, locationInfo, posts }) {
  const darkMode = useSelector(selectDarkmode);
  const router = useRouter();
  const [selectLocation, setSelectLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({});
  const [locationDetails, setLocationDetails] = useState(null);
  const [selectAreaInfo, setSelectAreaInfo] = useState(null);
  const [closeResult, setCloseResult] = useState(false);

  const [queryResult, setQueryResult] = useState([]);
  const coordinates = locationInfo?.map((result) => ({
    longitude: result?.properties?.lon,
    latitude: result?.properties?.lat,
  }));
  const center = getCenter(coordinates);

  const [viewport, setViewport] = useState({
    longitude: areaGeo?.lon,
    latitude: areaGeo?.lat,
    zoom: 10,
    width: "100%",
    height: "100%",
  });

  return (
    <div
      className={` ${
        darkMode ? "page-bg-dark text-white" : "bg-std text-black"
      }`}
    >
      <main className="flex flex-col h-full w-full p-3">
        <div className="flex flex-col items-center justify-center lg:flex-row w-full">
          <div className="h-full flex flex-col w-full lg:w-fit items-center justify-center mr-4 z-40">
            <div className="flex flex-row items-center justify-center space-x-2">
              <h2 className="font-bold text-center tracking-widest my-4 text-xl">
                Result
              </h2>

              {!closeResult ? (
                <IoChevronBackOutline
                  className="w-5 h-5"
                  onClick={() => setCloseResult(!closeResult)}
                />
              ) : (
                <IoChevronForwardOutline
                  className="w-5 h-5"
                  onClick={() => setCloseResult(!closeResult)}
                />
              )}
            </div>
            {!closeResult && (
              <div className="h-[50vh] overflow-y-scroll scrollbar-hide space-y-5 ">
                {locationInfo?.map((result, index) => (
                  <div
                    onClick={() => setSelectLocation(result?.properties.name)}
                    key={index}
                    className={`border p-4 cursor-pointer mx-4 rounded-xl  ${
                      selectLocation === result?.properties?.name &&
                      "border-cyan-500"
                    }`}
                  >
                    <div className="flex flex-col items-start justify-start whitespace-nowrap">
                      <h2 className="text-lg font-semibold">
                        {result?.properties.name}
                      </h2>
                      <p className="text-sm font-medium">
                        {result?.properties.city}
                      </p>
                      <div className="flex flex-wrap whitespace-nowrap">
                        {result?.properties?.categories?.map(
                          (category, index) => (
                            <div key={index} className="">
                              {category?.replace(type?.toString(), "")}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="xl:inline-flex xl:min-w-[400px]">
            <Map
              onClick={() => setLocationDetails({})}
              {...viewport}
              onMove={(evt) => setViewport(evt.viewport)}
              style={{ width: "90vw", height: "70vh", objectFit: "contain" }}
              mapStyle="mapbox://styles/zonghong/cks1a85to4kqf18p6zuj5zdx6"
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
            >
              {locationInfo?.map((location, idx) => (
                <div key={idx}>
                  <Marker
                    longitude={Number(location?.properties?.lon)}
                    latitude={Number(location?.properties?.lat)}
                    color="red"
                    onClick={() =>
                      setSelectedLocation(location?.properties?.lon)
                    }
                  >
                    <div
                      onClick={() =>
                        setSelectedLocation(location?.properties?.lon)
                      }
                      className={`flex flex-col items-center justify-center group ${""}`}
                    >
                      {location?.properties?.categories[0] === "catering" && (
                        <IoRestaurantOutline
                          className={`w-6 h-6 text-emerald-500  ${
                            selectLocation === location?.properties?.name &&
                            "text-fuchsia-500 opacity-100"
                          }`}
                        />
                      )}
                      {location?.properties?.categories[0] ===
                        "accommodation" && (
                        <RiHotelLine
                          className={`w-6 h-6 text-emerald-500  ${
                            selectLocation === location?.properties?.name &&
                            "text-fuchsia-500 opacity-100"
                          }`}
                        />
                      )}
                      {location?.properties?.categories[0] === "tourism" && (
                        <FaRegGem
                          className={`w-6 h-6 text-emerald-500  ${
                            selectLocation === location?.properties?.name &&
                            "text-fuchsia-500 opacity-100"
                          }`}
                        />
                      )}
                      {location?.properties?.categories[0] ===
                        "entertainment" && (
                        <MdOutlineTour
                          className={`w-6 h-6 text-emerald-500  ${
                            selectLocation === location?.properties?.name &&
                            "text-fuchsia-500 opacity-100"
                          }`}
                        />
                      )}

                      <div className={``}>
                        <p className="font-bold tracking-widest">
                          {selectLocation === location?.properties?.name &&
                            location?.properties?.name}
                        </p>
                        <p></p>
                      </div>
                    </div>
                  </Marker>
                  {selectedLocation === location?.properties?.lon ? (
                    <div className="w-96 ">
                      <Popup
                        closeOnClick={false}
                        onClose={() => setLocationDetails(null)}
                        latitude={location?.properties?.lat}
                        longitude={location?.properties?.lon}
                      >
                        <div
                          onClick={() => {
                            setLocationDetails(location?.properties);
                          }}
                          className="cursor-pointer relative"
                        >
                          <p className="font-bold hover:underline text-black">
                            {location?.properties?.name}
                          </p>
                          <IoCloseOutline
                            onClick={() => setSelectedLocation({})}
                            className="text-red-500 absolute -top-2 -right-2"
                          />
                        </div>
                      </Popup>
                    </div>
                  ) : (
                    false
                  )}
                </div>
              ))}
              {locationDetails?.name?.length > 0 ? (
                <div
                  className={`${
                    locationDetails ? "flex flex-col" : "hidden"
                  } rounded-lg absolute p-4 top-2 left-2 z-50  lg:top-10 lg:left-10 bg-white shadow-md w-3/4 lg:w-1/4 h-fit  text-black`}
                >
                  <h1 className="text-center font-bold mb-2 text-xl">
                    {locationDetails?.name}
                  </h1>
                  <div className="grid grid-flow-row-dense gap-1">
                    {locationDetails?.categories?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center flex-wrap truncate  "
                      >
                        <p className="font-medium ">{item}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center space-x-1">
                    <p className="font-light flex-grow">
                      Distance: {locationDetails?.distance / 1000}
                      <span className="font-bold ml-1">KM</span>{" "}
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
            </Map>
          </div>
        </div>
        <div className="my-4 space-y-2">
          <h2 className="text-xl font-bold tracking-widest">
            Ways to tour to {router.query.id}
          </h2>
          <p className="text-sm tracking-wider">
            More things to do for your next trip
          </p>
          <div className=" p-2 lg:p-4 grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {posts?.map((post) => (
              <>
                {post?.mainImage ? (
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
                ) : (
                  <></>
                )}
              </>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Index;
export const getServerSideProps = async (context) => {
  const input = context.query.id.toString();

  const location = await fetchgeoInfo(input);
  const areaGeo = await fetchAreageo(input);
  const locationInfo = await fetchCommonAreaInfo(areaGeo);
  const posts = await fetchgeopost(input);
  if (!location) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      input,
      location,
      areaGeo,
      locationInfo,
      posts,
    },
  };
};
