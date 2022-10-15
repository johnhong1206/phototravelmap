import React, { useState } from "react";
import Link from "next/link";

import {
  IoRestaurantOutline,
  IoCameraOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoSunnyOutline,
  IoMoon,
  IoClipboardOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoPersonOutline,
  IoMapOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { GiChampions } from "react-icons/gi";
import { selectUser, logout } from "../features/userSlice";
import { useRouter } from "next/router";
import { selectDarkmode, updateDarkMode } from "../features/darkmodeSlice";
import { removeInfo } from "../features/placeinfoSlice";

function HeaderItemsMobile({ open, setOpen }) {
  const router = useRouter();

  const darkMode = useSelector(selectDarkmode);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const userLogout = () => {
    router.replace("/");
    dispatch(logout());
    dispatch(removeInfo());
  };
  return (
    <div className="flex lg:hidden items-center space-x-8 w-full overflow-x-scroll scrollbar-hide">
      <Link href="/food">
        <IoRestaurantOutline
          className={`w-6 h-6 hover:text-green-400  cursor-pointer ${
            darkMode ? "text-white" : "text-gray-500/90"
          }`}
        />
      </Link>
      <Link href="/travel">
        <IoCameraOutline
          className={`w-6 h-6 hover:text-purple-400  cursor-pointer ${
            darkMode ? "text-white" : "text-gray-500/90"
          }`}
        />
      </Link>
      <Link href="/blog">
        <IoMapOutline
          className={`w-6 h-6 hover:text-teal-400  cursor-pointer ${
            darkMode ? "text-white" : "text-gray-500/90"
          }`}
        />
      </Link>
      <Link href="/leaderboard">
        <GiChampions
          className={`w-6 h-6 hover:text-rose-400  cursor-pointer ${
            darkMode ? "text-white" : "text-gray-500/90"
          }`}
        />
      </Link>
      {user && (
        <Link href={`/userprofile/${user?.email}`}>
          <IoPersonOutline
            className={`w-6 h-6 hover:text-rose-400  cursor-pointer ${
              darkMode ? "text-white" : "text-gray-500/90"
            }`}
          />
        </Link>
      )}

      {user && (
        <Link href={`/tripplans/${user?.email}`}>
          <IoClipboardOutline
            className={`w-6 h-6 hover:text-teal-400  cursor-pointer ${
              darkMode ? "text-white" : "text-gray-500/90"
            }`}
          />
        </Link>
      )}
      {user ? (
        <IoLogInOutline
          onClick={userLogout}
          className={`w-7 h-7 hover:text-fuchsia-400  cursor-pointer ${
            darkMode ? "text-white" : "text-gray-500/90"
          }`}
        />
      ) : (
        <Link href="/signin">
          <IoLogOutOutline
            className={`w-7 h-7 hover:text-red-400  IoLogOutOutline cursor-pointer ${
              darkMode ? "text-white" : "text-gray-500/90"
            }`}
          />
        </Link>
      )}
      {darkMode ? (
        <IoMoon
          onClick={() => dispatch(updateDarkMode(false))}
          className="w-6 h-6 text-yellow-200 cursor-pointer"
        />
      ) : (
        <IoSunnyOutline
          onClick={() => dispatch(updateDarkMode(true))}
          className="w-6 h-6 text-orange-400 cursor-pointer"
        />
      )}
      <IoChevronForwardOutline
        onClick={() => setOpen(!open)}
        className="w-6 h-6 text-orange-400 cursor-pointer"
      />
    </div>
  );
}

export default HeaderItemsMobile;
