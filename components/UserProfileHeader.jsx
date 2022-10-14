import React from "react";
import { AiOutlineFire, AiOutlineStar, AiOutlinePicture } from "react-icons/ai";

function UserProfileHeader({ name, email, averageRating, rating, postCount }) {
  return (
    <div className="text-white p-4 flex flex-col items-center justify-center">
      <div className="mb-4">
        <h2 className="text-xl lg:text-3xl text-center font-bold tracking-wide">
          {name}
        </h2>
        <p className="text-sm text-center mt-2  tracking-widest">{email}</p>
      </div>
      <div className="flex items-center justify-start space-x-8">
        <div className="flex items-center space-x-1">
          <p>{rating?.toFixed(2)}</p>
          <AiOutlineFire className="text-rose-400 w-5 h-5" />
        </div>
        <div className="flex items-center space-x-1">
          <p>{averageRating?.toFixed(2)}</p>
          <AiOutlineStar className="text-emerald-400 w-5 h-5" />
        </div>
        <div className="flex items-center space-x-1">
          <p>{postCount}</p>
          <AiOutlinePicture className="text-cyan-400 w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default UserProfileHeader;
