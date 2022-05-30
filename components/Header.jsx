import React from "react";
import Link from "next/link";

function Header() {
  return (
    <header className="z-50 px-4 py-3 sticky top-0 flex item-center justify-between">
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
    </header>
  );
}

export default Header;
