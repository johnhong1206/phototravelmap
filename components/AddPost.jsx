import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDarkmode } from "../features/darkmodeSlice";
import {
  openCategoryModal,
  closeCategoryModal,
  openLocationModal,
  closeLocationModal,
  selectCategoryModalIsOpen,
  selectLocationModalIsOpen,
} from "../features/modalSlice";
import { selectUser } from "../features/userSlice";
import {
  AiOutlinePlusCircle,
  AiOutlineClose,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";
import toast from "react-hot-toast";

function AddPost({
  posts,
  location,
  categories,
  setPhase,
  handleRefresh,
  authorPostCount,
  userRating,
  userAverageRating,
  userId,
}) {
  const dispatch = useDispatch();
  const scrollbarRef = useRef(null);
  const darkMode = useSelector(selectDarkmode);
  const user = useSelector(selectUser);
  const locationModalisOpen = useSelector(selectLocationModalIsOpen);
  const categoryModalisOpen = useSelector(selectCategoryModalIsOpen);
  const [title, setTitle] = useState("");
  const slug = title.concat("-", user?.username);
  const [postType, setPostType] = useState("public");
  const [selectlocation, setSelectLocation] = useState(null);
  const [selectCategory, setSelectCategory] = useState(null);
  const [activeLocation, setActiveLocation] = useState(selectlocation);
  const [activeCategory, setActiveCategory] = useState(selectCategory);
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

  const updateuserRating = async () => {
    const postInfo = {
      id: userId,
      rating: userRating,
      averageRating: userAverageRating,
      authorPostCount: Number(authorPostCount) + Number(1),
    };
    const notification = toast.loading("Rate the Author...");

    try {
      await fetch(`/api/updateuserrating`, {
        body: JSON.stringify(postInfo),
        method: "POST",
      }).then((res) => {
        toast.success(" Rate Success", {
          id: notification,
        });
      });
    } catch (error) {
      console.error(error);
      toast.error("You Already Rate This Post", {
        id: notification,
      });
    }
  };

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
      postType: postType,
      author: user?.id,
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
      return false;
    }

    if (!!postTitleExist == false) {
      try {
        await fetch("/api/post", {
          body: JSON.stringify(postInfo),
          method: "POST",
        }).then((res) => {
          updateuserRating();
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

  const scroll = (scrollOffset) => {
    scrollbarRef.current.scrollLeft += scrollOffset;
  };

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-screen ${
        darkMode ? "page-bg-dark" : "bg-slate-200"
      }`}
    >
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
      <div
        className={`bg-gray-100 bg-opacity-10 shadow-md  rounded-md backdrop-filter backdrop-blur-3xl cursor-pointer flex-1`}
      >
        <div className="w-full flex-1 rounded-lg">
          <h2 className="text-lg font-semibold px-5">Title:</h2>
          <input
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent  font-bold tracking-widest p-2 px-5 h-full w-full flex-grow rounded flex-shrink rounded-l-md focus:outline-none focus:shadow-2xl "
          />
        </div>
        <div className="w-full flex-1 rounded-lg p-5">
          <h2 className="text-lg font-semibold px-5 mb-4">Post Type:</h2>
          <select
            name="question1"
            className="text-black h-10 cursor-pointer flex-grow w-full outline-none focus:shadow-md focus:shadow-blue-500/50 rounded-2xl"
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
          >
            <option
              value={"public"}
              onChange={(e) => setPostType(e.target.value)}
            >
              Public
            </option>
            <option
              value={"private"}
              onChange={(e) => setPostType(e.target.value)}
            >
              Private
            </option>
          </select>
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
              className={`bg-transparent font-bold tracking-widest bg-gradient-to-l  p-2 px-5 h-full w-full flex-grow rounded flex-shrink rounded-l-md focus:outline-none
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
                  className={`transition-all duration-500  ease-in-out flex items-center justify-center h-12 min-h-12 max-h-12 truncate mx-1 px-2 w-auto text-center cursor-pointer rounded-xl ${
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
                  className={`bg-std text-black transition-all duration-500  ease-in-out flex items-center justify-center h-12 min-h-12 max-h-12 truncate mx-1 px-2 w-auto text-center cursor-pointer rounded-xl ${
                    activeLocation === location._id &&
                    "bg-gray-200 font-semibold shadow-2xl scale-110 shadow-cyan-500"
                  }`}
                >
                  {location.title}
                </div>
              ))}
          </div>

          <div className="flex flex-row items-center justify-between mb-4 w-full px-2">
            <AiOutlineLeft
              onClick={() => scroll(-200)}
              className="w-5 h-5 cursor-pointer text-cyan-400"
            />
            <div
              ref={scrollbarRef}
              className="scroll-smooth h-12 flex flex-row items-center justify-between space-x-4 lg:space-x-1 w-full overflow-x-scroll scrollbar-hide"
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
                className={`bg-std text-black transition-all duration-500  ease-in-out flex items-center justify-center h-12 min-h-12 max-h-24 px-2 w-auto text-center cursor-pointer rounded-xl ${
                  activeCategory === category._id &&
                  "bg-gray-200 font-semibold shadow-2xl scale-110 shadow-pink-500"
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
        <div className="w-full px-10">
          <button
            disabled={!title || !selectCategory || !selectlocation}
            className=" bg-pink-400 disabled:bg-opacity-50 w-full px-1 py-2 rounded-lg mt-10 shadow-lg hover:shadow-xl font-bold hover:text-white"
            onClick={post}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPost;
