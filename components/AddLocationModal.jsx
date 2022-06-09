import React, { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { closeLocationModal } from "../features/modalSlice";
import toast from "react-hot-toast";
import { selectDarkmode } from "../features/darkmodeSlice";

function AddLocationModal() {
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkmode);

  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectResult, setSelectResult] = useState(null);
  const [selectAddress, setSelectAddress] = useState(null);
  const [activeSelectResult, setActiveSelectResult] = useState(null);
  const [description, setDescription] = useState("");

  const searchLocationInfo = async () => {
    var requestOptions = {
      method: "GET",
    };
    const url = `https://api.geoapify.com/v1/geocode/search?text=${searchInput}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => setSearchResult(result.features))
      .catch((error) => console.log("error", error));
  };
  console.log(selectAddress);

  useEffect(() => {
    if (selectResult !== null) {
      const address = selectResult?.properties.address_line1.concat(
        " , ",
        selectResult?.properties.address_line2
      );
      setSelectAddress(address);
    }
  }, [selectResult]);

  const addLocation = async () => {
    const notification = toast.loading("Creating location...");

    const locationInfo = {
      title: selectResult?.properties.name,
      city: selectResult?.properties.city,
      state: selectResult?.properties.state,
      district: selectResult?.properties.district,
      country: selectResult?.properties.country,
      latitude: selectResult?.properties.lat.toString(),
      longitude: selectResult?.properties.lon.toString(),
      address: selectAddress,
      description: description,
    };
    await fetch("/api/addlocation", {
      body: JSON.stringify(locationInfo),
      method: "POST",
    })
      .then(() => {
        toast.success("Submit Location", {
          id: notification,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error creating post", {
          id: notification,
        });
      });

    setSearchInput("");
    setSearchResult([]);
    setSelectResult(null);
    setSelectAddress(null);
    setActiveSelectResult(null);
    setDescription("");
  };

  return (
    <div className=" fixed z-50 inset-1   bg-black bg-opacity-80 overflow-y-scroll scrollbar-hide ">
      <div className="w-full h-full min-h-screen relative">
        <AiOutlineClose
          onClick={() => dispatch(closeLocationModal(true))}
          className="absolute text-red-500 h-8 w-8 top-3 right-4 cursor-pointer hover:text-white"
        />
        <h1 className="text-center text-2xl font-bold text-white">
          Add Location
        </h1>

        <div className="p-10">
          <form className="w-full bg-pink-300  shadow-2xl rounded-full flex flex-row items-center">
            <input
              className="placeholder:text-gray-300 text-black rounded-full lg:text-2xl font-medium py-2 px-1 w-full bg-slate-50 outline-none text-lg focus:shadow-2xl focus:shadow-pink-500"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <AiOutlineSearch
              type="submit"
              onClick={searchLocationInfo}
              className="w-8 h-8 mx-2 text-white cursor-pointer hover:animate-pulse hover:text-blue-100"
            />
          </form>
        </div>
        <div className="">
          <h2
            className={`text-xl font-bold text-center ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Search Result
          </h2>
          <div className="grid grid-flow-row-dense md:grid-cols-2 gap-3 p-4">
            {searchResult &&
              searchResult?.map((result, idx) => (
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
                        <p className="font-light">
                          {result?.properties?.district}
                        </p>
                      </div>
                      <div className="flex flex-row items-center space-x-2">
                        <h2 className="font-semibold">State:</h2>
                        <p className="font-light">
                          {result?.properties?.state}
                        </p>
                      </div>
                      <div className="flex flex-row items-center space-x-2">
                        <h2 className="font-semibold">Country:</h2>
                        <p className="font-light">
                          {result?.properties?.country}
                        </p>
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
          </div>
        </div>
        <div className="p-4">
          {selectResult && (
            <div
              className={`${
                darkMode
                  ? "bg-gray-100 text-white hover:shadow-cyan-500/40 hover:shadow-lg"
                  : " bg-white text-black hover:shadow-2xl"
              }  bg-opacity-10 shadow-md  rounded-md backdrop-filter backdrop-blur-3xl cursor-pointer px-2 py-4 hover:shadow-md w-full h-full
        
          `}
            >
              <h2 className="text-xl font-bold text-center ">
                Select Location Info
              </h2>
              <div className="mt-4 flex flex-row items-center space-x-2">
                <h2 className="font-semibold">Name:</h2>
                <p className="font-light space-x-2">
                  {selectResult?.properties.name}
                </p>
              </div>
              <div className="mt-4 flex flex-row items-center space-x-2">
                <h2 className="font-semibold">State:</h2>
                <p className="font-light space-x-2">
                  {selectResult?.properties.state}
                </p>
              </div>
              <div className="mt-4 flex flex-row items-center space-x-2">
                <h2 className="font-semibold">Longitude:</h2>
                <p className="font-light space-x-2">
                  {selectResult?.properties.lon}
                </p>
              </div>
              <div className="mt-4 flex flex-row items-center space-x-2">
                <h2 className="font-semibold">Latitude:</h2>
                <p className="font-light space-x-2">
                  {selectResult?.properties.lat}
                </p>
              </div>
              <div className="mt-4 flex flex-row items-center space-x-2">
                <h2 className="font-semibold">Address:</h2>
                <p className="font-light space-x-2">{selectAddress}</p>
              </div>
              <div className="mt-4 flex flex-row items-center space-x-2">
                <h2 className="font-semibold">Description:</h2>
                <input
                  placeholder="description"
                  type="text"
                  className=" bg-transparent outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div
                onClick={addLocation}
                className="bg-blue-300 px-1 py-3 font-bold text-lg rounded-full text-center mt-4 hover:text-white "
              >
                Submit
              </div>
            </div>
          )}
        </div>

        <div className="pb-10" />
      </div>
    </div>
  );
}

export default AddLocationModal;
