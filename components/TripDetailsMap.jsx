import React, { useState, useRef } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { getCenter } from "geolib";
import "mapbox-gl/dist/mapbox-gl.css";
import { BiMapPin } from "react-icons/bi";
import { IoRestaurantOutline } from "react-icons/io5";
import { RiHotelLine } from "react-icons/ri";
import { MdOutlineTour, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FaRegGem, FaRegGrinBeam } from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { selectPlaceInfo, getAreaInfo } from "../features/placeinfoSlice";
import toast from "react-hot-toast";

function TripDetailsMap({ location, currentLocation }) {
  const dispatch = useDispatch();

  const placeInfo = useSelector(selectPlaceInfo);
  const [areaInfo, setAreaInfo] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchLocationResult, setSearchLocationResult] = useState([]);
  const excludeColumns = [];
  const [selectedLocation, setSelectedLocation] = useState({});
  const [locationDetails, setLocationDetails] = useState({});

  const coordinates =
    location &&
    location?.map((result) => ({
      longitude: result?.location?.longitude,
      latitude: result?.location?.latitude,
    }));

  const center = getCenter(coordinates);
  const [viewport, setViewport] = useState({
    longitude: location ? center?.longitude : currentLocation?.longitude,
    latitude: location ? center?.latitude : currentLocation?.latitude,
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
        setAreaInfo(responseData);
        dispatch(getAreaInfo(responseData));
        toast.success(
          `${currentLocation?.title} area info updated successfully`,
          {
            id: refresnToast,
          }
        );
      })
      .catch((error) => console.log("error", error));
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

  return (
    <div className="relative flex  items-center justify-center">
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
      <div className="absolute z-50 top-10 right-4 flex items-center justify-center space-x-4">
        <IoRestaurantOutline
          className="w-5 h-5 cursor-pointer text-yellow-400"
          onClick={() => handleChange("catering")}
        />
        <RiHotelLine
          className="w-4 h-4 text-cyan-400"
          onClick={() => handleChange("accommodation")}
        />
        <MdOutlineTour
          className="w-4 h-4 text-fuchsia-400"
          onClick={() => handleChange("tourism")}
        />
        <FaRegGem
          className="w-4 h-4 text-red-400"
          onClick={() => handleChange("heritage")}
        />
        <FaRegGrinBeam
          className="w-4 h-4 text-purple-400"
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
        <Marker
          longitude={Number(currentLocation.longitude)}
          latitude={Number(currentLocation.latitude)}
          color="red"
          onClick={() => setSelectedLocation(post)}
        >
          <div className="flex flex-col items-center justify-center">
            <BiMapPin className="w-6 h-6 text-red-400" />
            <p>You are Here</p>
          </div>
        </Marker>
        {coordinates?.map((location, idx) => (
          <div key={idx} className="relative">
            {location && (
              <Marker
                longitude={Number(location.longitude)}
                latitude={Number(location.latitude)}
                color="red"
                onClick={() => setSelectedLocation(post)}
              >
                <div className="bg-white h-8  w-20 text-black flex items-center justify-center rounded-full first-letter: wabsolute top-0 -right-4">
                  <p>
                    <span>No:{idx + 1}</span>
                    <span className="ml-1">Place</span>
                  </p>
                </div>
              </Marker>
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
                  onClick={() => setSelectedLocation(result?.properties?.lon)}
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
                        onClick={() => setLocationDetails(result?.properties)}
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
                  onClick={() => setSelectedLocation(result?.properties?.lon)}
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
                        onClick={() => setLocationDetails(result?.properties)}
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
        )}{" "}
      </Map>
    </div>
  );
}

export default TripDetailsMap;
