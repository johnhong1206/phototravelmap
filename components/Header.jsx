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
import HeaderItems from "./HeaderItems";
import HeaderItemsMobile from "./HeaderItemsMobile";

function Header() {
  const router = useRouter();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkmode);
  const [open, setOpen] = useState(false);

  const userLogout = () => {
    router.replace("/");
    dispatch(logout());
    dispatch(removeInfo());
  };

  return (
    <header
      className={`z-50 px-5 py-3 sticky top-0 flex item-center justify-between ${
        darkMode ? "head-bg-dark" : "bg-std"
      } `}
    >
      {!open ? (
        <Link href="/">
          <div className="group transition-all hover:duration-700 ease-in-out hover:underline cursor-pointer hover:decoration-rose-400/50 ">
            <h2 className=" text-xl font-extralight tracking-widest ">
              <span className="font-bold text-blue-400 group-hover:text-blue-500">
                ZH
              </span>
              <span className="font-bold text-red-400 group-hover:text-red-500 ml-2  group-hover:animate-pulse  group-hover：underline">
                P
              </span>
              <span
                className={`${
                  darkMode ? "text-white" : "text-gray-500/90"
                } font-medium`}
              >
                hotography
              </span>
            </h2>
          </div>
        </Link>
      ) : (
        <></>
      )}
      <HeaderItems />

      {!open ? (
        <IoChevronBackOutline
          onClick={() => setOpen(!open)}
          className="w-6 h-6 text-orange-400 cursor-pointer inline-flex lg:hidden"
        />
      ) : (
        <HeaderItemsMobile open={open} setOpen={setOpen} />
      )}
    </header>
  );
}

export default Header;
