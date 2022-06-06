import React from "react";
import { urlFor } from "../sanity";
import { useRouter } from "next/router";
import Image from "next/image";
import { AiTwotoneFire } from "react-icons/ai";
import { selectDarkmode } from "../features/darkmodeSlice";
import { useDispatch, useSelector } from "react-redux";

function AdminPostList({ posts, setSelectPost, selectPost }) {
  console.log(selectPost);
  const router = useRouter();
  const darkMode = useSelector(selectDarkmode);

  const navDetails = () => {
    router.push(`/post/${selectPost?.slug.current}`);
  };
  console.log(selectPost?.rating);
  return (
    <div className={`flex flex-col lg:flex-row`}>
      <div className="p-4 w-full lg:w-[50vw] h-[20vh] lg:h-[75vh] space-y-4 overflow-y-auto">
        {posts?.map((post) => (
          <div
            key={post._id}
            className={`transition-all duration-500  ease-in-out p-2 m-4  lg:p-4 lg:m-8 cursor-pointer bg-gray-100 backdrop-filter backdrop-blur-3xl bg-opacity-10  shadow-md rounded-xl 
                  ${
                    selectPost?._id === post?._id &&
                    " shadow-2xl shadow-cyan-500 scale-105"
                  }`}
            onClick={() => setSelectPost(post)}
          >
            {post.title}
          </div>
        ))}
      </div>
      <div className="p-4 w-full lg:w-[50vw]">
        <div>
          <h1 className="text-xl text-center font-bold">Post Info</h1>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row items-center space-x-2 w-full">
            <h2 className="text-xl font-medium">Title:</h2>
            <p className="font-light">{selectPost?.title}</p>
          </div>
          <div className="flex flex-row items-center space-x-2 w-full">
            <h2 className="text-xl font-medium">Post Type:</h2>
            <div className="bg-gray-900 flex items-center justify-center leading-5 px-[1rem] py-[2px] rounded-full text-sm font-light italic">
              <p>{selectPost?.postType && selectPost?.postType}</p>
            </div>
          </div>
          <div className="flex flex-row items-center space-x-2 w-full">
            <h2 className="text-xl font-medium">Rating:</h2>
            <div className="flex items-center space-x-1">
              <p className="font-light ">{selectPost?.rating}</p>
              <AiTwotoneFire className=" w-4 h-4 text-red-500/80" />
            </div>
          </div>
          <div className="hidden lg:flex flex-row items-center space-x-2">
            <h2 className="text-xl font-medium">Id:</h2>
            <p className="font-light ">{selectPost?._id}</p>
          </div>
        </div>

        <div className="flex flex-row items-center space-x-2">
          <h2 className="text-xl font-medium">Post Date:</h2>
          <p className="font-light">{selectPost?.publishedAt}</p>
        </div>
        <div className="hidden lg:flex flex-row items-center space-x-2">
          {selectPost?.mainImage && (
            <Image
              layout="fixed"
              width={300}
              height={300}
              quality="75"
              className="h-60 w-full object-contain transition-transform duration-200 ease-in-out group-hover:scale-105"
              src={urlFor(selectPost?.mainImage).url()}
              alt="img"
            />
          )}
        </div>
        <div className="flex lg:hidden flex-row items-center space-x-2">
          {selectPost?.mainImage && (
            <Image
              layout="fixed"
              width={200}
              height={200}
              quality="75"
              className="h-60 w-full object-contain transition-transform duration-200 ease-in-out group-hover:scale-105"
              src={urlFor(selectPost?.mainImage).url()}
              alt="img"
            />
          )}
        </div>
        <div className="flex flex-row items-center space-x-2">
          <h2 className="text-xl font-medium">Location:</h2>
          <p className="font-light">{selectPost?.location?.title}</p>
        </div>
        <div className="flex flex-row items-center space-x-2 mt-2">
          <h2 className="text-xl font-medium">Categories:</h2>
          <div className="grid grid-flow-row-dense grid-cols-3 gap-3">
            {selectPost?.categories &&
              selectPost?.categories.map((category) => (
                <div
                  key={category._id}
                  className="bg-gray-700 text-white px-3 py-[0.1rem] rounded-xl"
                >
                  <p className="font-medium">{category?.title}</p>
                </div>
              ))}
          </div>
        </div>
        <div className="flex flex-row items-center space-x-2 mt-2">
          <h2 className="text-xl font-medium">Tags:</h2>
          <div className="grid grid-flow-row-dense grid-cols-3 gap-3">
            {selectPost?.categoryTags &&
              selectPost?.categoryTags?.map((categoryTag, idx) => (
                <div
                  key={idx}
                  className="bg-gray-700 text-white px-3 py-[0.1rem] rounded-xl"
                >
                  <p className="font-medium">{categoryTag}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPostList;
