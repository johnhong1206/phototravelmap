import React from "react";
import { selectDarkmode } from "../features/darkmodeSlice";
import { useSelector } from "react-redux";
import { sanityClient, urlFor } from "../sanity";
import Image from "next/image";
import { useRouter } from "next/router";

function Post({ post }) {
  const router = useRouter();
  const navDetails = () => {
    router.push(`/post/${post?.slug?.current}`);
  };

  const darkMode = useSelector(selectDarkmode);
  return (
    <div
      onClick={navDetails}
      key={post?._id}
      className={`${
        darkMode
          ? "bg-gray-100 text-white hover:shadow-cyan-500/40 hover:shadow-lg"
          : " bg-white text-black hover:shadow-2xl"
      }  bg-opacity-10 shadow-md  rounded-md backdrop-filter backdrop-blur-3xl cursor-pointer px-2 py-4 hover:shadow-md w-full h-full`}
    >
      <div className="w-full">
        <div className="flex flex-row items-center h-16">
          <div className="flex flex-col items-start flex-1">
            <h2 className="flex-1 font-bold line-clamp-6">{post?.title}</h2>
            <p>{post?.location?.title}</p>
          </div>
          {post?.author?.image && (
            <div className="flex flex-row items-center">
              <Image
                width={35}
                height={35}
                layout="fixed"
                objectFit="cover"
                src={urlFor(post?.author?.image).url()}
                alt="author"
                className="h-10 w-10 rounded-full"
              />
              <div
                className="ml-1 
      flex flex-col"
              >
                <p className="text-sm font-bold">@{post?.author.name}</p>
                <p className="text-xs font-light text-gray-400">
                  {new Date(post?.publishedAt).toDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-flow-row-dense grid-cols-2 gap-2 mt-2 mb-1">
        {post?.categoryTags?.map((value) => (
          <div className="bg-gray-800 text-white flex items-center justify-center rounded-full w-full h-6 text-sm">
            {value}
          </div>
        ))}
      </div>
      <div className="mt-2">
        {post?.mainImage && (
          <Image
            layout="responsive"
            width={500}
            height={500}
            quality="75"
            className="h-60 w-full object-contain transition-transform duration-200 ease-in-out group-hover:scale-105"
            src={urlFor(post?.mainImage).url()}
            alt="img"
          />
        )}
      </div>
    </div>
  );
}

export default Post;
