import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectDarkmode } from "../../../../features/darkmodeSlice";
import { fetchgeoInfo } from "../../../../utils/fetchgeoinfo";
import { useRouter } from "next/router";
import Footer from "../../../../components/Footer";

function Index({ location, input }) {
  const darkMode = useSelector(selectDarkmode);
  const router = useRouter();
  const [selectResult, setSelectResult] = useState(null);
  const [activeSelectResult, setActiveSelectResult] = useState(null);

  const navAdvanceResult = (e) => {
    router.push(
      `/advanceresult/${selectResult?.properties.lon}_${selectResult?.properties.lat}_${selectResult?.properties.name}/${router.query.type}`
    );
  };
  return (
    <div
      className={`min-h-screen ${
        darkMode ? "page-bg-dark text-white" : "bg-std text-black"
      }`}
    >
      <div className="flex items-center justify-center flex-col pt-4">
        <h1 className=" text-xl font-normal">
          <span className="mx-4 tracking-widest font-semibold uppercase">
            {input}
          </span>
        </h1>
        <p className="mt-3 text-sm">
          {location?.features?.length} Result found
        </p>
      </div>
      <main className="grid grid-flow-row-dense md:grid-cols-2 gap-3 p-4">
        {location?.features?.length > 0 &&
          location?.features?.map((result, idx) => (
            <div
              onClick={() => {
                setSelectResult(result);
                setActiveSelectResult(idx);
              }}
              key={idx}
              className={`${
                darkMode
                  ? "bg-gray-100 text-white hover:shadow-cyan-500/40 hover:shadow-lg"
                  : " bg-white text-black hover:shadow-2xl"
              }  bg-opacity-10 shadow-md  rounded-md backdrop-filter backdrop-blur-3xl cursor-pointer px-2 py-4 hover:shadow-md w-full h-full
          ${activeSelectResult === idx && "shadow-cyan-500"}
          `}
            >
              <h1 className="font-bold text-xl">Result {idx + 1}</h1>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold">Name:</h2>
                  <p className="font-light">{result?.properties?.name}</p>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <h2 className="font-semibold">Address:</h2>
                  <p className="font-light">
                    {result?.properties?.address_line1}
                    {result?.properties?.address_line2}
                  </p>
                </div>
                <div className="mt-4 gap-1 grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-row items-center space-x-2">
                    <h2 className="font-semibold">City:</h2>
                    <p className="font-light">{result?.properties?.city}</p>
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    <h2 className="font-semibold">District:</h2>
                    <p className="font-light">{result?.properties?.district}</p>
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    <h2 className="font-semibold">State:</h2>
                    <p className="font-light">{result?.properties?.state}</p>
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    <h2 className="font-semibold">Country:</h2>
                    <p className="font-light">{result?.properties?.country}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-row items-center space-x-2">
                  <h2 className="font-semibold">GPS Location:</h2>
                  <p className="font-light space-x-2">
                    <span>{result.properties.lon}</span>
                    <span>,</span>
                    <span>{result?.properties?.lat}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
      </main>
      {selectResult && (
        <div className="mt-4 flex items-center justify-center w-full flex-1 px-4 py-2">
          <button
            onClick={navAdvanceResult}
            className={`bg-[#008080] bg-gradient-to-r from-[#06202A]  text-white w-full rounded h-10 lg:h-8 font-bold hover:shadow-xl`}
          >
            Go {selectResult?.properties.name} result
          </button>
        </div>
      )}
    </div>
  );
}

export default Index;
export const getServerSideProps = async (context) => {
  const input = context.query.id.toString();

  const location = await fetchgeoInfo(input);
  // const areaGeo = await fetchAreageo(input);
  // const locationInfo = await fetchCommonAreaInfo(areaGeo);
  // const posts = await fetchgeopost(input);
  if (!location) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      input,
      location,
      // areaGeo,
      // locationInfo,
    },
  };
};
