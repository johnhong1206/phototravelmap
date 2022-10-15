import React, { useState } from "react";
import toast from "react-hot-toast";

function AddPostCategories({
  handleRefresh,
  selectPost,
  categories,
  setPhase,
  setSelectPost,
}) {
  const [selectCategory, setSelectCategory] = useState(null);
  const [activeCategory, setActiveCategory] = useState(selectCategory);

  const addCategory = async () => {
    if (!selectPost?._id) false;
    const notification = toast.loading("Update Categories...");
    const categoryInfo = {
      _id: selectPost?._id,
      category: selectCategory?._id,
    };

    await fetch("/api/addcategoriestopost", {
      body: JSON.stringify(categoryInfo),
      method: "POST",
    }).then(() => {
      toast.success("Categories Add Success", {
        id: notification,
      });
    });
    handleRefresh();
    setSelectCategory("");
    setActiveCategory("");
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
      <div className="flex flex-row items-center space-x-2">
        <h2 className="text-xl font-medium">category to add</h2>
        <p className="font-light">{selectCategory?.title}</p>
      </div>
      <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-10 ">
        {categories?.map((category) => (
          <div
            className={`transition-all duration-500 ease-in-out flex items-center justify-center h-12 min-h-12 max-h-24 px-2 w-auto text-center cursor-pointer rounded-xl ${
              activeCategory === category._id &&
              "bg-gray-300 text-blue-500 font-semibold shadow-md scale-110"
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
      <div className="w-full px-10">
        <button
          disabled={!selectCategory || !selectPost}
          className=" bg-pink-400 disabled:bg-opacity-50 w-full px-1 py-2 rounded-lg mt-10 shadow-lg hover:shadow-xl font-bold hover:text-white"
          onClick={addCategory}
        >
          {!selectPost ? "please pick a post" : "Add"}
        </button>
      </div>
    </div>
  );
}

export default AddPostCategories;
