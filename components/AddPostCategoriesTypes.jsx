import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { getUniqueValues } from "../utils/helper";

function AddPostCategoriesTypes({
  handleRefresh,
  selectPost,
  categories,
  setPhase,
  setSelectPost,
  posts,
}) {
  const [newCategoryTags, setNewCategoryTags] = useState("");
  const availableTypes = posts ? getUniqueValues(posts, "categoryTags") : null;
  const [activeCategoType, setActiveCategoType] = useState(null);
  const [selectCategory, setSelectCategory] = useState(null);

  const addCategoryTypes = async () => {
    if (!selectPost?._id) false;
    const notification = toast.loading("Update Categories Tag...");
    const categoryInfo = {
      _id: selectPost?._id,
      categoryTag: newCategoryTags,
    };
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
      <div className="flex flex-row lg:grid grid-flow-row-dense lg:grid-cols-7 gap-4 items-center justify-center space-x-4 overflow-x-auto px-4">
        {availableTypes?.map((value, idx) => (
          <div
            onClick={() => setNewCategoryTags(value)}
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
      <div className="flex flex-row items-center my-5">
        <input
          placeholder="New Categories Tag"
          value={newCategoryTags}
          onChange={(e) => setNewCategoryTags(e.target.value)}
          className={`shadow-2xl shadow-cyan-400 bg-transparent font-bold tracking-widest bg-gradient-to-l  p-2 px-5 h-full w-full flex-grow rounded flex-shrink rounded-l-md focus:outline-none
          `}
        />
      </div>

      {/* <div className="flex flex-row items-center space-x-2">
        <h2 className="text-xl font-medium">category to add</h2>
        <p className="font-light">{selectCategory?.title}</p>
        <p className="font-light">{selectCategory?._id}</p>
      </div> */}
      <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-10 ">
        {/* {categories?.map((category) => (
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
        ))} */}
      </div>
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
