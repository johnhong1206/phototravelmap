import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectDarkmode } from "../features/darkmodeSlice";
import { getUniqueValues } from "../utils/helper";

function AddPostCategoriesTypes({
  handleRefresh,
  selectPost,
  categories,
  setPhase,
  setSelectPost,
  posts,
}) {
  const darkMode = useSelector(selectDarkmode);

  const [newCategoryTags, setNewCategoryTags] = useState("");
  const [searchCatTypesResult, setSearchCatTypesResult] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [checkTags, setCheckTags] = useState(null);
  const [tag, setTag] = useState(null);

  const availableTypes = posts ? getUniqueValues(posts, "categoryTags") : null;
  const [currentpage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const indexOfLastPost = currentpage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentTypes = availableTypes?.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(availableTypes?.length / postsPerPage); i++) {
    pageNumber.push(i);
  }
  const handleChange = (value) => {
    setNewCategoryTags(value);
    filterData(value);
  };

  const filterData = (value) => {
    const Value = value?.toLocaleUpperCase()?.trim();

    if (Value === "" || Value === undefined || Value === null) {
      setSearchCatTypesResult(availableTypes);
      setShowResults(false);
    } else {
      setShowResults(true);
      const filteredData = availableTypes.filter((item) =>
        item?.toString().toLocaleUpperCase().includes(Value)
      );
      setSearchCatTypesResult(filteredData);
    }
  };
  useEffect(() => {
    const cheackTagExist = selectPost?.categoryTags?.find((tag) =>
      tag?.toLocaleString().toLocaleLowerCase().includes(newCategoryTags)
    );
    setCheckTags(!!cheackTagExist);
  }, [selectPost, newCategoryTags]);

  const addCategoryTypes = async () => {
    if (!selectPost?._id) false;
    if (!newCategoryTags) false;

    const notification = toast.loading("Update Categories Tag...");
    const categoryInfo = {
      _id: selectPost?._id,
      categoryTag: newCategoryTags,
    };

    if (!!checkTags === true) {
      toast.error("Tag already used , please choose another", {
        id: notification,
      });
    }
    if (!!checkTags === false) {
      await fetch("/api/addcategoriesTagtopost", {
        body: JSON.stringify(categoryInfo),
        method: "POST",
      }).then(() => {
        toast.success("Categories Tag Add Success", {
          id: notification,
        });
      });
      handleRefresh();
      setNewCategoryTags("");
      setSelectPost(null);
      setPhase("Post");
    }
  };

  return (
    <div>
      <div className="flex flex-row items-center space-x-2">
        <h2 className="text-xl font-medium">Title:</h2>
        <p className="font-light">{selectPost?.title}</p>
      </div>
      <div className="flex flex-row items-center space-x-2">
        <h2 className="text-xl font-medium">Post Id:</h2>
        <p className="font-light">{selectPost?._id}</p>
      </div>
      <div className="flex flex-row items-center space-x-2 mt-2">
        <h2 className="text-xl font-medium">Categories Tag:</h2>
        <div className="grid grid-flow-row-dense grid-cols-3 gap-3">
          {selectPost?.categoryTags &&
            selectPost?.categoryTags.map((categoryTag, idx) => (
              <div
                key={idx}
                className="bg-gray-700 text-white px-3 py-[0.1rem] rounded-xl"
              >
                <p className="font-medium">{categoryTag}</p>
              </div>
            ))}
        </div>
      </div>
      <div className="flex flex-row items-center space-x-2">
        <h2 className="text-xl font-medium">New Categories Tag:</h2>
        <p className="font-light">{newCategoryTags}</p>
      </div>
      <div className="flex flex-row items-center my-5">
        <input
          placeholder="New Categories Tag"
          value={newCategoryTags}
          onChange={(e) => handleChange(e.target.value)}
          className={`shadow-2xl shadow-cyan-400 bg-transparent font-bold tracking-widest bg-gradient-to-l  p-2 px-5 h-full w-full flex-grow rounded flex-shrink rounded-l-md focus:outline-none
          `}
        />
      </div>
      <div className="flex flex-row lg:grid grid-flow-row-dense lg:grid-cols-7 gap-4 items-center justify-center space-x-4 overflow-x-auto px-4">
        {showResults &&
          searchCatTypesResult?.map((value, idx) => (
            <div
              onClick={() => handleChange(value)}
              key={idx}
              className={`bg-gray-800 uppercase shadow-pink-500/20 shadow-md  opacity-70 tracking-widest m-1 cursor-pointer transition-all duration-500  ease-in-out text-white flex items-center justify-center rounded-full w-40 h-6 text-sm ${
                newCategoryTags == value &&
                "opacity-100 shadow border border-cyan-600 shadow-cyan-500 scale-110 "
              }`}
            >
              {value}
            </div>
          ))}
        {!showResults &&
          currentTypes?.map((value, idx) => (
            <div
              onClick={() => handleChange(value)}
              key={idx}
              className={`bg-gray-800 uppercase shadow-pink-500/20 shadow-md  opacity-70 tracking-widest m-1 cursor-pointer transition-all duration-500  ease-in-out text-white flex items-center justify-center rounded-full w-40 h-6 text-sm ${
                newCategoryTags == value &&
                "opacity-100 shadow border border-cyan-600 shadow-cyan-500 scale-110 "
              }`}
            >
              {value}
            </div>
          ))}
      </div>
      <div className="mt-4 flex flex-row items-center justify-center space-x-2">
        {pageNumber.map((number) => (
          <div
            key={number}
            className={`grid place-items-center transition-all duration-500 ease-in-out cursor-pointer hover:animate-pulse  bg-opacity-50 w-6 h-6 leading-6  text-white rounded-full 
                ${darkMode ? "bg-gray-300 text-blue-700" : "bg-gray-900"}
                ${currentpage == number && "bg-opacity-100 scale-125"}
             `}
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

      {/* <div className="flex flex-row items-center space-x-2">
        <h2 className="text-xl font-medium">category to add</h2>
        <p className="font-light">{selectCategory?.title}</p>
        <p className="font-light">{selectCategory?._id}</p>
      </div> */}
      <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-10 "></div>
      <button
        disabled={!newCategoryTags}
        className=" bg-pink-400 w-full px-1 py-2 rounded-lg mt-10 shadow-lg hover:shadow-xl font-bold hover:text-white"
        onClick={addCategoryTypes}
      >
        Add
      </button>
    </div>
  );
}

export default AddPostCategoriesTypes;
