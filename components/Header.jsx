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

      <div className="hidden lg:flex items-center space-x-4">
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
        <Link href={`/userprofile/${user?.email}`}>
          <IoPersonOutline
            className={`w-6 h-6 hover:text-fuchsia-400  cursor-pointer ${
              darkMode ? "text-white" : "text-gray-500/90"
            }`}
          />
        </Link>
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
      </div>
      {!open ? (
        <IoChevronBackOutline
          onClick={() => setOpen(!open)}
          className="w-6 h-6 text-orange-400 cursor-pointer inline-flex lg:hidden"
        />
      ) : (
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
          <Link href="/leaderboard">
            <IoPersonOutline
              className={`w-6 h-6 hover:text-rose-400  cursor-pointer ${
                darkMode ? "text-white" : "text-gray-500/90"
              }`}
            />
          </Link>

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
      )}
    </header>
  );
}

export default Header;
