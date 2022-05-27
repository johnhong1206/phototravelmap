import React from "react";
import { urlFor } from "../sanity";
import { useRouter } from "next/router";
import Image from "next/image";

function AdminPostList({ posts, setSelectPost, selectPost }) {
  const router = useRouter();

  const navDetails = () => {
    router.push(`/post/${selectPost?.slug.current}`);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="p-4 w-full lg:w-[50vw] h-[15vh] lg:h-[75vh] space-y-4 overflow-y-auto">
        {posts?.map((post) => (
          <div
            key={post._id}
            className={`p-4 m-8 cursor-pointer bg-white shadow-md rounded-xl  ${
              selectPost?._id === post?._id && "bg-slate-200 sha"
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

        <div className="flex flex-row items-center space-x-2">
          <h2 className="text-xl font-medium">Title:</h2>
          <p className="font-light">{selectPost?.title}</p>
        </div>
        <div className="flex flex-row items-center space-x-2">
          <h2 className="text-xl font-medium">Id:</h2>
          <p className="font-light">{selectPost?._id}</p>
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
                <div className="bg-gray-700 text-white px-3 py-[0.1rem] rounded-xl">
                  <p className="font-medium">{category?.title}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPostList;
