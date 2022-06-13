import React, { useState, useRef } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { getCenter } from "geolib";
import "mapbox-gl/dist/mapbox-gl.css";
import { AiOutlineClose } from "react-icons/ai";
import { BiMapPin } from "react-icons/bi";
import { IoRestaurantOutline } from "react-icons/io5";
import { RiHotelLine } from "react-icons/ri";
import {
  MdOutlineTour,
  MdChevronLeft,
  MdChevronRight,
  MdOutlineAddBox,
} from "react-icons/md";
import { FaRegGem, FaRegGrinBeam } from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { selectPlaceInfo, getAreaInfo } from "../features/placeinfoSlice";
import toast from "react-hot-toast";
import {
  addInfoFromMap,
  addItemFromMap,
  openLocationModal,
} from "../features/modalSlice";

function TripDetailsMap({
  initalLocationState,
  location,
  currentLocation,
  plans,
}) {
  const dispatch = useDispatch();
  const placeInfo = useSelector(selectPlaceInfo);
  const [showResults, setShowResults] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchLocationResult, setSearchLocationResult] = useState([]);
  const excludeColumns = [];
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectAreaInfo, setSelectAreaInfo] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);
  const [queryOption, setQueryOption] = useState("");
  const [myLocation, setMyLocation] = useState(null);

  const coordinates =
    initalLocationState == false &&
    location?.map((result) => ({
      longitude: result?.location?.longitude,
      latitude: result?.location?.latitude,
    }));

  const center = getCenter(coordinates);
  const [viewport, setViewport] = useState({
    longitude: initalLocationState
      ? currentLocation?.longitude
      : center?.longitude,
    latitude: initalLocationState
      ? currentLocation?.latitude
      : center?.latitude,
    zoom: 13,
    width: "100%",
    height: "100%",
  });

  const getInfo = async () => {
    const refresnToast = toast.loading(
      `Getting ${currentLocation?.title} area info`
    );

    var requestOptions = {
      method: "GET",
    };
    const url = `https://api.geoapify.com/v2/places?categories=catering,tourism,heritage,accommodation,entertainment&filter=circle:${currentLocation?.longitude},${currentLocation?.latitude},10000&bias=proximity:${currentLocation?.longitude},${currentLocation?.latitude}&limit=30&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`;
    await fetch(url, requestOptions)
      .then((response) => response.json())
      .then((responseData) => {
        dispatch(getAreaInfo(responseData));
        toast.success(
          `${currentLocation?.title} area info updated successfully`,
          {
            id: refresnToast,
          }
        );
      })
      .catch((error) => {
        return false;
      });
  };

  const getSelectAreaInfo = async () => {
    const refresnToast = toast.loading(
      `Getting ${selectedLocation?.title} area info your gps is ${selectedLocation?.longitude} , ${selectedLocation?.longitude}`
    );
    var requestOptions = {
      method: "GET",
    };
    const longitude = selectedLocation?.longitude.toString();
    const latitude = selectedLocation?.latitude.toString();
    const queryOptionUrl = `https://api.geoapify.com/v2/places?categories=${queryOption.toString()}&filter=circle:${longitude},${latitude},10000&bias=proximity:${longitude},${latitude}&limit=50&apiKey=${
      process.env.NEXT_PUBLIC_GEOAPIFY_KEY
    }`;
    const defaultUrl = `https://api.geoapify.com/v2/places?categories=catering,tourism,heritage,accommodation,entertainment&filter=circle:${longitude},${latitude},10000&bias=proximity:${longitude},${latitude}&limit=30&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`;

    const url = queryOption ? queryOptionUrl : defaultUrl;

    try {
      await fetch(url, requestOptions)
        .then((response) => response.json())
        .then((responseData) => {
          console.log("responseData", responseData);
          setMyLocation(selectedLocation?.title);
          dispatch(getAreaInfo(responseData));
          toast.success(
            `${selectedLocation?.title} area info updated successfully`,
            {
              id: refresnToast,
            }
          );
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      toast.error(
        `Something went wrong for fetching area info of ${selectedLocation?.title}`,
        {
          id: refresnToast,
        }
      );
    }
  };

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

  const addLocationToModal = () => {
    dispatch(openLocationModal(true));
    dispatch(addInfoFromMap(true));
    dispatch(addItemFromMap(locationDetails));
  };

  return (
    <div className="relative flex  items-center justify-center">
      {locationDetails?.name?.length > 0 ? (
        <div
          className={`${
            locationDetails ? "flex flex-col" : "hidden"
          } rounded-lg absolute p-4 top-2 left-2 z-50  lg:top-10 lg:left-10 bg-white shadow-md w-3/4 lg:w-1/4 h-fit  text-black`}
        >
          <MdOutlineAddBox
            onClick={addLocationToModal}
            className="absolute top-2 right-4 text-sky-400 w-5 h-5 cursor-pointer hover:text-blue-600"
          />

          <h1 className="text-center font-bold mb-2 text-xl">
            {locationDetails?.name}
          </h1>
          <div className="grid grid-flow-row-dense gap-1">
            {locationDetails?.categories?.map((item, idx) => (
              <div key={idx} className="flex items-center flex-wrap truncate  ">
                <p className="font-medium ">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap items-center space-x-1">
            <p className="font-light flex-grow">
              Distance: {locationDetails?.distance / 1000}
              <span className="font-bold ml-1">KM</span>{" "}
              {myLocation && <span className="font-light">From</span>}
            </p>
            {myLocation}
          </div>
          <div className="mt-2">
            <h2 className="text-center font-semibold mb-2 text-lg">Address</h2>
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

      {selectedLocation !== null && (
        <div
          className={`${
            selectedLocation !== null ? "flex flex-col" : "hidden"
          } rounded-lg absolute p-4 top-2 left-2 z-50  lg:top-10 lg:left-10 bg-white shadow-md w-3/4 lg:w-1/4 h-fit  text-black`}
        >
          <h1 className="text-center font-bold mb-2 text-xl">
            {selectedLocation?.title}
          </h1>
          <div className="grid grid-flow-row-dense  md:grid-cols-2 gap-2">
            {/* {locationDetails?.categories?.map((item, idx) => (
      <div key={idx} className="">
        <p>{item}</p>
      </div>
    ))} */}
          </div>
          <div className="mt-2">
            <h2 className="text-center font-semibold mb-2 text-lg">Address</h2>
            <p>{selectedLocation?.address}</p>
          </div>
          <div className="mt-2">
            <h2 className="text-center font-semibold mb-2 text-lg">
              Description
            </h2>
            <p>{selectedLocation?.description}</p>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-4 w-full">
              <IoRestaurantOutline
                className={`w-5 h-5 transition-all duration-500  ease-in-out cursor-pointer text-yellow-400 ${
                  queryOption === "catering" && "scale-125"
                }`}
                onClick={() => setQueryOption("catering")}
              />
              <RiHotelLine
                className={`w-5 h-5 transition-all duration-500  ease-in-out cursor-pointer text-cyan-400  ${
                  queryOption === "accommodation" && "scale-125"
                }`}
                onClick={() => setQueryOption("accommodation")}
              />
              <MdOutlineTour
                className={`w-5 h-5 transition-all duration-500  ease-in-out cursor-pointer text-fuchsia-400 ${
                  queryOption === "tourism" && "scale-125"
                }`}
                onClick={() => setQueryOption("tourism")}
              />
              <FaRegGem
                className={`w-5 h-5 transition-all duration-500  ease-in-out cursor-pointer text-red-400 ${
                  queryOption === "heritage" && "scale-125"
                }`}
                onClick={() => setQueryOption("heritage")}
              />
              <FaRegGrinBeam
                className={`w-5 h-5 transition-all duration-500  ease-in-out cursor-pointer text-purple-400 ${
                  queryOption === "entertainment" && "scale-125"
                }`}
                onClick={() => setQueryOption("entertainment")}
              />
            </div>
            <button
              onClick={getSelectAreaInfo}
              className="bg-fuchsia-800 text-white font-bold px-3 py-1 w-full mt-2 rounded-xl hover:shadow-xl hover:shadow-cyan-500/20"
            >
              Get Area Info {queryOption && "by"} {queryOption}
            </button>
          </div>

          <button
            onClick={() => setSelectedLocation(null)}
            className="bg-cyan-800 text-white font-bold px-3 py-1 w-full mt-2 rounded-xl hover:shadow-xl hover:shadow-cyan-500/20"
          >
            Close
          </button>
        </div>
      )}
      <div className="absolute z-50 top-10 right-4 flex items-center justify-center space-x-4">
        {showResults && (
          <div className="flex items-center space-x-4">
            <IoRestaurantOutline
              className={`w-5 h-5 transition-all duration-500  ease-in-out cursor-pointer text-yellow-400 ${
                searchLocation === "catering" && "scale-150"
              }`}
              onClick={() => handleChange("catering")}
            />
            <RiHotelLine
              className={`w-5 h-5 cursor-pointer transition-all duration-500  ease-in-out text-cyan-400 ${
                searchLocation === "accommodation" && "scale-150"
              }`}
              onClick={() => handleChange("accommodation")}
            />
            <MdOutlineTour
              className={`w-5 h-5 cursor-pointer transition-all duration-500  ease-in-out text-fuchsia-400 ${
                searchLocation === "tourism" && "scale-150"
              }`}
              onClick={() => handleChange("tourism")}
            />
            <FaRegGem
              className={`w-5 h-5 cursor-pointer transition-all duration-500  ease-in-out text-red-400 ${
                searchLocation === "heritage" && "scale-150"
              }`}
              onClick={() => handleChange("heritage")}
            />
            <FaRegGrinBeam
              className={`w-5 h-5 cursor-pointer transition-all duration-500  ease-in-out text-purple-400 ${
                searchLocation === "entertainment" && "scale-150"
              }`}
              onClick={() => handleChange("entertainment")}
            />
            <BiRefresh
              onClick={getInfo}
              className=" text-blue-500 h-6 w-6 cursor-pointer text-twitterBlue transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
            />
          </div>
        )}
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
        {initalLocationState && (
          <Marker
            longitude={Number(currentLocation?.longitude)}
            latitude={Number(currentLocation?.latitude)}
            color="red"
            onClick={() => setSelectedLocation(location?.location)}
          >
            <div
              className={`flex flex-col items-center justify-center ${
                myLocation === location?.location?.title &&
                "animate-pulse scale-150"
              }`}
            >
              <BiMapPin className="w-6 h-6 text-red-400" />
              <div></div>
            </div>
          </Marker>
        )}

        {location?.map((location, idx) => (
          <div key={idx}>
            <Marker
              longitude={Number(location?.location?.longitude)}
              latitude={Number(location?.location?.latitude)}
              color="red"
              onClick={() => setSelectedLocation(location?.location)}
            >
              <div
                className={`flex flex-col items-center justify-center ${
                  myLocation === location?.location?.title &&
                  "animate-pulse scale-150"
                }`}
              >
                <BiMapPin className="w-6 h-6 text-red-400" />
                <div>{location?.location?.title}</div>
              </div>
            </Marker>
          </div>
        ))}
        {selectedLocation?.city && (
          <div>
            <Popup
              closeOnClick={false}
              onClose={() => setSelectedLocation(null)}
              longitude={Number(selectedLocation?.longitude)}
              latitude={Number(selectedLocation?.latitude)}
            >
              <div className="cursor-pointer">
                <p className="font-bold hover:underline text-black">
                  {selectedLocation?.title}
                </p>
              </div>
            </Popup>
          </div>
        )}
        {showResults ? (
          <>
            {searchLocationResult?.map((result, idx) => (
              <div key={idx} className="">
                <Marker
                  longitude={Number(result?.properties?.lon)}
                  latitude={Number(result?.properties?.lat)}
                  color="red"
                  onClick={() => setSelectAreaInfo(result?.properties?.lon)}
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
                              className="w-4 h-4 cursor-pointer transition-all duration-500  ease-in-out text-yellow-400"
                              onClick={() => setSelectAreaInfo(result)}
                            />
                          )}
                          {item == "accommodation" && (
                            <RiHotelLine
                              className="w-4 h-4 cursor-pointer transition-all duration-500  ease-in-out text-cyan-400"
                              onClick={() => setSelectAreaInfo(result)}
                            />
                          )}
                          {item == "tourism" && (
                            <MdOutlineTour
                              className="w-4 h-4 cursor-pointer transition-all duration-500  ease-in-out text-fuchsia-400"
                              onClick={() => setSelectAreaInfo(result)}
                            />
                          )}
                          {item == "leisure" && (
                            <MdOutlineTour
                              className="w-4 h-4 cursor-pointer text-pink-400"
                              onClick={() => setSelectAreaInfo(result)}
                            />
                          )}
                          {item == "heritage" && (
                            <FaRegGem
                              className="w-4 h-4 cursor-pointer text-red-400"
                              onClick={() => setSelectAreaInfo(result)}
                            />
                          )}
                          {item == "entertainment" && (
                            <FaRegGrinBeam
                              className="w-4 h-4 cursor-pointer text-purple-400"
                              onClick={() => setSelectAreaInfo(result)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Marker>
                {selectAreaInfo === result?.properties?.lon ? (
                  <div>
                    <Popup
                      closeOnClick={false}
                      onClose={() => setSelectAreaInfo(null)}
                      latitude={result?.properties?.lat}
                      longitude={result?.properties?.lon}
                    >
                      <div
                        onClick={() => {
                          setLocationDetails(result?.properties);
                        }}
                        className="cursor-pointer relative "
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
                  onClick={() => setSelectAreaInfo(result?.properties?.lon)}
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
                              className="w-4 h-4 cursor-pointer transition-all duration-500  ease-in-out text-yellow-400"
                              onClick={() => setSelectAreaInfo(result)}
                            />
                          )}
                          {item == "accommodation" && (
                            <RiHotelLine
                              className="w-4 h-4 cursor-pointer transition-all duration-500  ease-in-out text-cyan-400"
                              onClick={() => setSelectAreaInfo(result)}
                            />
                          )}
                          {item == "tourism" && (
                            <MdOutlineTour
                              className="w-4 h-4 cursor-pointer transition-all duration-500  ease-in-out text-fuchsia-400"
                              onClick={() => setSelectAreaInfo(result)}
                            />
                          )}
                          {item == "leisure" && (
                            <MdOutlineTour
                              className="w-4 h-4 cursor-pointer transition-all duration-500  ease-in-out text-fuchsia-400"
                              onClick={() => setSelectAreaInfo(result)}
                            />
                          )}
                          {item == "heritage" && (
                            <FaRegGem
                              className="w-4 h-4 cursor-pointer transition-all duration-500  ease-in-out text-red-400"
                              onClick={() => setSelectAreaInfo(result)}
                            />
                          )}
                          {item == "entertainment" && (
                            <FaRegGrinBeam
                              className="w-4 h-4 cursor-pointer transition-all duration-500  ease-in-out text-purple-400"
                              onClick={() => setSelectAreaInfo(result)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Marker>
                {selectAreaInfo === result?.properties?.lon ? (
                  <div>
                    <Popup
                      closeOnClick={false}
                      onClose={() => setSelectAreaInfo(null)}
                      latitude={result?.properties?.lat}
                      longitude={result?.properties?.lon}
                    >
                      <div
                        onClick={() => {
                          setLocationDetails(result?.properties);
                        }}
                        className="cursor-pointer relative "
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
    </div>
  );
}

export default TripDetailsMap;
