import React from "react";
import Link from "next/link";
import { IoRestaurantOutline, IoCameraOutline } from "react-icons/io5";
function Header() {
  return (
    <header className="bg-white z-50 px-4 py-3 sticky top-0 flex item-center justify-between">
      <Link href="/">
        <div className="group transition-all hover:duration-700 ease-in-out hover:underline cursor-pointer hover:decoration-rose-400/50 ">
          <h2 className="text-xl font-extralight tracking-widest ">
            <span className="font-bold text-blue-400">ZH</span>
            <span className="font-bold text-red-400 ml-2  group-hover:animate-pulse  underline">
              P
            </span>
            hotography
          </h2>
        </div>
      </Link>
      <div className="flex items-center space-x-4">
        <Link href="/">
          <IoRestaurantOutline className="w-6 h-6 hover:text-green-400 text-gray-400 cursor-pointer" />
        </Link>
        <Link href="/">
          <IoCameraOutline className="w-6 h-6 hover:text-purple-400 text-gray-400 cursor-pointer" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
