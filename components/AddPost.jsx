import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openCategoryModal,
  closeCategoryModal,
  openLocationModal,
  closeLocationModal,
  selectCategoryModalIsOpen,
  selectLocationModalIsOpen,
} from "../features/modalSlice";
import {
  AiOutlinePlusCircle,
  AiOutlineClose,
  AiOutlineCamera,
} from "react-icons/ai";
import toast from "react-hot-toast";

function AddPost({ location, categories, fetchsome }) {
  const dispatch = useDispatch();

  const locationModalisOpen = useSelector(selectLocationModalIsOpen);
  const categoryModalisOpen = useSelector(selectCategoryModalIsOpen);

  const [title, setTitle] = useState("");

  const [selectlocation, setSelectLocation] = useState(null);
  const [selectCategory, setSelectCategory] = useState(null);
  const [activeLocation, setActiveLocation] = useState(selectlocation);
  const [activeCategory, setActiveCategory] = useState(selectCategory);
  const [author, setAuthor] = useState("5eecd9d7-38e3-4b5b-ab16-6489274dea76");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchLocationResult, setSearchLocationResult] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const excludeColumns = [];
  const [currentpage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const indexOfLastPost = currentpage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentLocation = location?.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(location?.length / postsPerPage); i++) {
    pageNumber.push(i);
  }

  const handleChange = (value) => {
    setSearchLocation(value);
    filterData(value);
  };

  const filterData = (value) => {
    const Value = value.toLocaleUpperCase().trim();
    if (Value === "") {
      setSearchLocationResult(location);
      setShowResults(false);
    } else {
      setShowResults(true);
      const filteredData = location.filter((item) => {
        return Object.keys(item).some((key) =>
          excludeColumns.includes(key)
            ? false
            : item[key]?.toString().toLocaleUpperCase().includes(Value)
        );
      });
      setSearchLocationResult(filteredData);
    }
  };

  const post = async () => {
    const notification = toast.loading("Creating location...");

    if (!title) {
      toast.error("Error creating post", {
        id: notification,
      });
      false;
    }
    if (!selectlocation?._id) {
      toast.error("Error creating post", {
        id: notification,
      });
      false;
    }
    if (!selectCategory?._id) {
      toast.error("Error creating post", {
        id: notification,
      });
      false;
    }

    const postInfo = {
      title: title,
      author: author,
      //   mainImage: "",
      publishedAt: new Date(),
      location: selectlocation?._id,
      category: selectCategory?._id,
    };
    console.log("post info: ", postInfo);

    await fetch("/api/post", {
      body: JSON.stringify(postInfo),
      method: "POST",
    }).then((res) => {
      console.log("res", res.body, res.json());
      toast.success("Post Success", {
        id: notification,
      });
    });

    setTitle("");
    setActiveLocation(null);
    setSelectLocation(null);
    setActiveCategory(null);
    setSelectCategory(null);
  };

  const openlocationModal = () => {
    if (!locationModalisOpen) {
      dispatch(openLocationModal());
    } else {
      dispatch(closeLocationModal());
    }
  };
  const openaddcategoriesModal = () => {
    if (!categoryModalisOpen) {
      dispatch(openCategoryModal());
    } else {
      dispatch(closeCategoryModal());
    }
  };

  return (
    <div className="flex flex-col lg:flex-row  bg-red-100 h-full">
      <div className="w-full lg:w-[35vw] bg-white p-4 hover:shadow-md cursor-pointer">
        <h1 className="font-bold text-3xl text-center">Posting Preview</h1>
        <div className="flex flex-row items-center space-x-2">
          <h2 className="font-bold text-2xl">Title:</h2>
          <p>{title}</p>
        </div>

        <div className="mt-4">
          <h2 className="font-bold text-2xl">Location</h2>
          {selectlocation && (
            <div className="space-y-6">
              <div className="flex flex-row items-center space-x-2">
                <h2 className="text-xl font-medium">Title:</h2>
                <p className="font-light">{selectlocation?.title}</p>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <h2 className="text-xl font-medium">State: </h2>
                <p className="font-light">{selectlocation?.state}</p>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <h2 className="text-xl font-medium">GPS: </h2>
                <p className="font-light">
                  <span>{selectlocation?.longitude}</span>
                  <span>,</span>
                  <span>{selectlocation?.latitude}</span>
                </p>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <h2 className="text-xl font-medium">Address: </h2>
                <p className="font-light">{selectlocation?.address}</p>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <h2 className="text-xl font-medium">Description: </h2>
                <p className="font-light">{selectlocation?.description}</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <h2 className="font-bold text-2xl">Categories</h2>
          {selectCategory && (
            <div className="flex flex-row items-center space-x-2 mt-1">
              <h2 className="text-xl font-medium">Title: </h2>
              <p className="font-light">{selectCategory?.title}</p>
            </div>
          )}
        </div>
      </div>

      <div className="hover:shadow-md bg-white flex-1">
        <div className="w-full flex-1 rounded-lg">
          <h2 className="text-lg font-semibold px-5">Title:</h2>
          <input
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-bold tracking-widest  text-gray-800  p-2 px-5 h-full w-full flex-grow rounded flex-shrink rounded-l-md focus:outline-none focus:shadow-2xl focus:bg-gray-100"
          />
        </div>
        <div>
          <div className="flex flex-col items-center mt-3 mx-2">
            <div className="flex items-center space-x-4 w-full">
              <h2 className="text-lg font-semibold">Location</h2>
              {locationModalisOpen ? (
                <AiOutlineClose
                  onClick={openlocationModal}
                  className="w-4 lg:w-5 h-4 lg:h-5 text-red-500  cursor-pointer"
                />
              ) : (
                <AiOutlinePlusCircle
                  onClick={openlocationModal}
                  className="w-4 lg:w-5 h-4 lg:h-5 text-blue-400 cursor-pointer"
                />
              )}
            </div>
            <input
              value={searchLocation}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Search anything you need... (Live Search by Filter)"
              className={` font-bold tracking-widest bg-gradient-to-l text-gray-800 p-2 px-5 h-full w-full flex-grow rounded flex-shrink rounded-l-md focus:outline-none
          `}
              type="text"
            />
          </div>

          <div className="grid grid-flow-row-dense grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-10 ">
            {showResults &&
              searchLocationResult?.map((location) => (
                <div
                  key={location._id}
                  value={location._id}
                  onClick={() => {
                    setSelectLocation(location);
                    setActiveLocation(location._id);
                  }}
                  className={`transition-all duration-500  ease-in-out flex items-center justify-center h-12 min-h-12 max-h-24 px-2 w-auto text-center cursor-pointer rounded-xl ${
                    activeLocation === location._id &&
                    "bg-gray-200 font-semibold shadow-md scale-110"
                  }`}
                >
                  {location.title}
                </div>
              ))}
            {!showResults &&
              currentLocation?.map((location) => (
                <div
                  key={location._id}
                  value={location._id}
                  onClick={() => {
                    setSelectLocation(location);
                    setActiveLocation(location._id);
                  }}
                  className={`transition-all duration-500  ease-in-out flex items-center justify-center h-12 min-h-12 max-h-24 px-2 w-auto text-center cursor-pointer rounded-xl ${
                    activeLocation === location._id &&
                    "bg-gray-200 font-semibold shadow-md scale-110"
                  }`}
                >
                  {location.title}
                </div>
              ))}
          </div>

          <div className="flex flex-row items-center justify-center space-x-2">
            {pageNumber.map((number) => (
              <div
                key={number}
                className={`flex items-center justify-center cursor-pointer hover:animate-pulse w-6 h-6 leading-6 bg-gray-500 text-white rounded-full ${
                  currentpage == number && "bg-gray-900"
                }`}
              >
                <a
                  onClick={() => paginate(number)}
                  className="tracking-widest text-sm "
                >
                  {number}
                </a>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2 mt-3 mx-2">
            <h2 className="text-lg font-semibold">Categories</h2>
            {categoryModalisOpen ? (
              <AiOutlineClose
                onClick={openaddcategoriesModal}
                className="w-4 lg:w-5 h-4 lg:h-5 text-red-500"
              />
            ) : (
              <AiOutlinePlusCircle
                onClick={openaddcategoriesModal}
                className="w-4 lg:w-5 h-4 lg:h-5 text-blue-400"
              />
            )}
          </div>

          <div className="grid grid-flow-row-dense grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-10 ">
            {categories?.map((category) => (
              <div
                className={`transition-all duration-500 ease-in-out flex items-center justify-center h-12 min-h-12 max-h-24 px-2 w-auto text-center cursor-pointer rounded-xl ${
                  activeCategory === category._id &&
                  "bg-gray-200 font-semibold shadow-md scale-110"
                }`}
                key={category._id}
                value={category._id}
                onClick={() => {
                  setSelectCategory(category);
                  setActiveCategory(category._id);
                }}
              >
                {category.title}
              </div>
            ))}
          </div>
        </div>

        <button
          disabled={!title || !selectCategory || !selectlocation}
          className=" bg-pink-400 w-full px-1 py-2 rounded-lg mt-10 shadow-lg hover:shadow-xl font-bold hover:text-white"
          onClick={post}
        >
          Post
        </button>
      </div>
    </div>
  );
}

export default AddPost;
