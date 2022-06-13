import { useRouter } from "next/router";
import React from "react";
import { IoCheckmark } from "react-icons/io5";
import { useSelector } from "react-redux";
import { selectDarkmode } from "../features/darkmodeSlice";

function PlanList({ plan, key }) {
  const router = useRouter();

  const darkMode = useSelector(selectDarkmode);
  const navDetails = () => {
    router.push(`/tripplandetails/${plan?._id}`);
  };
  return (
    <div
      onClick={navDetails}
      key={key}
      className={`${
        darkMode
          ? "bg-gray-100 text-white hover:shadow-cyan-500/40 hover:shadow-lg"
          : " bg-white text-black hover:shadow-2xl"
      } flex  felx-row items-center justify-between  bg-opacity-10 shadow-md  rounded-md backdrop-filter backdrop-blur-3xl cursor-pointer px-2 py-4 hover:shadow-md w-full h-14 `}
    >
      <div className="flex flex-row items-center space-x-2">
        <h1 className="text-lg">{plan?.title}</h1>
        <p className="text-sm text-gray-400">
          {new Date(plan?.tripDate).toDateString()}
        </p>
      </div>
      <div>
        {plan?.tripComplete === true && (
          <IoCheckmark className={"w-6 h-6 text-blue-400"} />
        )}
      </div>
    </div>
  );
}

export default PlanList;
