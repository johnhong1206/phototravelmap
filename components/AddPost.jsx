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
import PostFeeds from "./PostFeeds";

function AddPost({ posts, location, categories, setPhase, handleRefresh }) {
  const dispatch = useDispatch();

  const locationModalisOpen = useSelector(selectLocationModalIsOpen);
  const categoryModalisOpen = useSelector(selectCategoryModalIsOpen);

  const [title, setTitle] = useState("");
  const slug = title.concat("-", "Zong-Hong");

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

  const postTitleExist = posts?.find(
    (post) => post?.title.toLocaleLowerCase() === title.toLocaleLowerCase()
  );
  console.log("!!postTitleExist", !!postTitleExist, postTitleExist);

  const post = async (e) => {
    e.preventDefault();
    const notification = toast.loading("Posting...");

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
      rating: Number(0),
      slug: slug,
      //   mainImage: "",
      publishedAt: new Date().toISOString(),
      location: selectlocation?._id,
      category: selectCategory?._id,
    };

    const postTitleExist = posts?.find((post) => post?.title === title);

    if (!!postTitleExist == true) {
      toast.error("Title already exists Please Choose a new title", {
        id: notification,
      });
    }

    if (!!postTitleExist == false) {
      try {
        await fetch("/api/post", {
          body: JSON.stringify(postInfo),
          method: "POST",
        }).then((res) => {
          console.log("res", res.body, res.json());
          toast.success("Post Success", {
            id: notification,
          });
        });
      } catch (err) {
        toast.error("Something went wrong", {
          id: notification,
        });
      }
    }

    setTitle("");
    setActiveLocation(null);
    setSelectLocation(null);
    setActiveCategory(null);
    setSelectCategory(null);
    setPhase("Post");
    handleRefresh();
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
  console.log("location", selectlocation);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-200">
      <div className="w-full h-[50vh] lg:w-[35vw]  p-4">
        <div className="bg-white text-black cursor-pointer px-2 py-4 hover:shadow-md w-full h-full">
          <div className="w-full border-b border-gray-100">
            <div className="flex flex-row items-center h-16">
              <h2 className="flex-1 font-bold truncate">{title}</h2>
            </div>
            {selectlocation && (
              <div className="flex flex-col">
                <p className="font-bold">{selectlocation?.title}</p>
                <p className="text-sm font-medium text-gray-400">
                  <span className="mr-1">GPS:</span>
                  {selectlocation?.longitude}
                  <span className="mx-1">{","}</span>
                  <span>{selectlocation?.latitude}</span>
                </p>
              </div>
            )}
            {selectCategory && (
              <div className="flex flex-col bg-gray-900 w-1/6 mt-4 items-center px-4 py-1 rounded-full">
                <p className="text-sm font-medium text-gray-200">
                  {selectCategory?.title}
                </p>
              </div>
            )}
          </div>
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
