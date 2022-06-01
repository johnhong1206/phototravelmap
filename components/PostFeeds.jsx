import React from "react";
import { urlFor } from "../sanity";
import Image from "next/image";
import { useRouter } from "next/router";

function PostFeeds({
  key,
  title,
  author,
  slug,
  mainImage,
  categories,
  id,

  location,
  body,
  publishedAt,
}) {
  const router = useRouter();

  const navDetails = () => {
    router.push(`/post/${slug.current}`);
  };

  return (
    <div
      key={key}
      onClick={navDetails}
      className="bg-white text-black cursor-pointer px-2 py-4 hover:shadow-md w-full h-full"
    >
      <div className="w-full border-b border-gray-100">
        <div className="flex flex-row items-center h-16">
          <div className="flex flex-col items-start flex-1">
            <h2 className="flex-1 font-bold line-clamp-6">{title}</h2>
            <p>{location?.title}</p>
          </div>
          {author?.image && (
            <div className="flex flex-row items-center">
              <Image
                width={35}
                height={35}
                layout="fixed"
                objectFit="cover"
                src={urlFor(author?.image).url()}
                alt="author"
                className="h-10 w-10 rounded-full"
              />
              <div className="ml-1 flex flex-col">
                <p className="text-sm font-bold">@{author.name}</p>
                <p className="text-xs font-light text-gray-400">
                  {new Date(publishedAt).toDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2">
        {mainImage && (
          <Image
            layout="responsive"
            width={500}
            height={500}
            quality="75"
            className="h-60 w-full object-contain transition-transform duration-200 ease-in-out group-hover:scale-105"
            src={urlFor(mainImage).url()}
            alt="img"
          />
        )}
      </div>
    </div>
  );
}

export default PostFeeds;
