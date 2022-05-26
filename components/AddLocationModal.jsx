import React, { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { closeLocationModal } from "../features/modalSlice";
import toast from "react-hot-toast";

function AddLocationModal() {
  const dispatch = useDispatch();

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

  const fetchLocation = () => {};

  const addLocation = async () => {
    const notification = toast.loading("Creating location...");

    const locationInfo = {
      title: selectResult?.properties.name,
      state: selectResult?.properties.state,
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
    <div className=" fixed z-50 inset-1  bg-black bg-opacity-75 overflow-y-scroll ">
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
              className="placeholder:text-gray-300  rounded-full lg:text-2xl font-medium py-2 px-1 w-full bg-slate-50 outline-none text-lg focus:shadow-2xl focus:shadow-pink-500"
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
          <h2 className="text-xl font-bold text-center text-white">
            Search Result
          </h2>
          <div className="grid grid-flow-row-dense md:grid-cols-2 ">
            {searchResult.map((result, idx) => (
              <div
                onClick={() => {
                  setSelectResult(result);
                  setActiveSelectResult(idx);
                }}
                key={idx}
                className={` bg-white m-12 p-4 lg:p-10 shadow-md cursor-pointer ${
                  activeSelectResult === idx && "shadow-xl shadow-pink-500/50"
                }`}
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
                      <p className="font-light">{result?.properties?.state}</p>
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
        {selectResult && (
          <div className="bg-white m-12 p-4 lg:p-10 shadow-md cursor-pointer">
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
                className=" outline-none"
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
        <div className="pb-10" />
      </div>
    </div>
  );
}

export default AddLocationModal;
