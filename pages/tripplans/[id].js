import React, { useState, useEffect } from "react";
import Head from "next/head";
import { sanityClient, urlFor } from "../../sanity";
import {
  AiOutlinePlusCircle,
  AiOutlineClose,
  AiOutlineCamera,
} from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";

import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { selectDarkmode } from "../../features/darkmodeSlice";
import toast from "react-hot-toast";
import {
  closeLocationModal,
  openLocationModal,
  selectLocationModalIsOpen,
} from "../../features/modalSlice";
import PlanList from "../../components/PlanList";

function UserTripPlans({ location, userInfo, tripplans }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const darkMode = useSelector(selectDarkmode);
  const locationModalisOpen = useSelector(selectLocationModalIsOpen);
  // const [userInfo, setUserInfo] = useState(null);

  const [selectlocation, setSelectLocation] = useState(null);
  const [activeLocation, setActiveLocation] = useState(selectlocation);
  const [title, setTitle] = useState("");
  const [tripDate, setTripDate] = useState(new Date());
  // const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchLocationResult, setSearchLocationResult] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const excludeColumns = [];
  const [currentpage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const indexOfLastPost = currentpage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentLocation = location?.slice(indexOfFirstPost, indexOfLastPost);
  const [plans, setPlans] = useState(tripplans);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(location?.length / postsPerPage); i++) {
    pageNumber.push(i);
  }

  const handleChange = (value) => {
    setSearchLocation(value);
    filterData(value);
  };

  const handleRefresh = async () => {
    const refresnToast = toast.loading("Refreshing Plans...");

    const tripplansquery = `*[_type == "tripplans" && email == $email ]{
    ...
  }`;
    const plans = await sanityClient.fetch(tripplansquery, {
      email: userInfo?.email,
    });
    setPlans(plans);
    toast.success("Plans Updated", { id: refresnToast });
  };

  const filterData = (value) => {
    const Value = value.toLocaleUpperCase().trim();
    if (Value === "") {
      setSearchLocationResult(location);
      setShowResults(false);
    } else {
      setShowResults(true);
      const filteredData = location.filter((item) => {
        return Object.keys(item).some((key) =>
          excludeColumns.includes(key)
            ? false
            : item[key]?.toString().toLocaleUpperCase().includes(Value)
        );
      });
      setSearchLocationResult(filteredData);
    }
  };
  const openlocationModal = () => {
    if (!locationModalisOpen) {
      dispatch(openLocationModal());
    } else {
      dispatch(closeLocationModal());
    }
  };
  const createPlan = async (e) => {
    e.preventDefault();
    const notification = toast.loading("Create plan...");
    const planInfo = {
      title: title,
      slug: title.concat("-", user.email),
      email: userInfo?.email,
      tripComplete: false,
      user: userInfo?._id,
      tripDate: new Date(tripDate).toISOString(),
      location: selectlocation?._id,
      description: description,
    };
    try {
      await fetch(`/api/createtripplan`, {
        body: JSON.stringify(planInfo),
        method: "POST",
      }).then((res) => {
        console.log(res);
        toast.success("Plan Create Success", {
          id: notification,
        });
        handleRefresh();
      });
    } catch (err) {
      toast.error("Something went wrong", {
        id: notification,
      });
    }
  };

  return (
    <div
      className={` ${
        darkMode ? "page-bg-dark text-white" : "bg-std text-black"
      }`}
    >
      <main className="flex w-full h-screen overflow-hidden flex-1 flex-col lg:flex-row">
        <div className="w-full lg:w-[50vw] p-4 ">
          <div className="flex flex-row items-center justify-center space-x-2">
            <h1 className="text-center my-4 text-xl lg:text-3xl">
              Your Plan List
            </h1>
            <BiRefresh
              onClick={handleRefresh}
              className=" text-blue-500 h-6 w-6 cursor-pointer text-twitterBlue transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
            />
          </div>
          <div className="p-4 w-full lg:w-[50vw] h-[20vh] lg:h-[75vh] space-y-4 overflow-y-auto">
            {plans.map((plan) => (
              <PlanList plan={plan} key={plan?._id} />
            ))}
            <div className="pb-1" />
          </div>
        </div>
        <div className="w-full lg:w-[50vw] p-4 h-full overflow-y-scroll scrollbar-hide ">
          <h1 className="text-center my-4 text-xl lg:text-3xl">Trip Plan </h1>
          {/* <button onClick={handleRefresh}>handleRefresh </button> */}
          <form
            className={`${
              darkMode
                ? "bg-gray-100 text-white hover:shadow-cyan-500/40 hover:shadow-lg"
                : " bg-white text-black hover:shadow-2xl"
            } space-y-4 mt-2  bg-opacity-10 shadow-md  rounded-md backdrop-filter backdrop-blur-3xl cursor-pointer px-2 py-4 hover:shadow-md w-full`}
          >
            <div className="flex flex-col items-center space-x-2">
              <h2 className="text-lg font-medium">Title:</h2>
              <input
                className=" w-full outline-none h-8 bg-transparent"
                placeholder="Your Trip Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center space-x-2">
              <h2 className="text-lg font-medium">Trip Date:</h2>
              <input
                type="date"
                value={tripDate}
                className="text-base text-white placeholder:text-blue-400  w-full outline-none h-8 bg-transparent"
                onChange={(e) => setTripDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center space-x-2">
              <div className="flex flex-row items-center space-x-2">
                <h2 className="text-lg font-medium">Destination:</h2>
                {locationModalisOpen ? (
                  <AiOutlineClose
                    onClick={openlocationModal}
                    className="w-4 lg:w-5 h-4 lg:h-5 text-red-500  cursor-pointer"
                  />
                ) : (
                  <AiOutlinePlusCircle
                    onClick={openlocationModal}
                    className="w-4 lg:w-5 h-4 lg:h-5 text-blue-400 cursor-pointer"
                  />
                )}
              </div>
              <input
                className=" w-full outline-none h-8 bg-transparent"
                placeholder="Your Trip Destination Name"
                value={searchLocation}
                onChange={(e) => handleChange(e.target.value)}
              />
              <div className="h-[20vh] lg:h-[15vh] scrollbar-hide overflow-y-scroll grid grid-flow-row-dense grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-10 ">
                {showResults &&
                  searchLocationResult?.map((location) => (
                    <div
                      key={location._id}
                      value={location._id}
                      onClick={() => {
                        setSelectLocation(location);
                        setActiveLocation(location._id);
                      }}
                      className={`transition-all duration-500  ease-in-out flex items-center justify-center min-h-12 px-2 w-auto text-center cursor-pointer rounded-xl ${
                        activeLocation === location._id &&
                        "bg-gray-200 font-semibold shadow-md scale-110"
                      }`}
                    >
                      {location.title}
                    </div>
                  ))}
                {!showResults &&
                  currentLocation?.map((location) => (
                    <div
                      key={location._id}
                      value={location._id}
                      onClick={() => {
                        setSelectLocation(location);
                        setActiveLocation(location._id);
                      }}
                      className={`bg-std text-black transition-all duration-500  ease-in-out flex items-center justify-center min-h-12 overflow-hidden truncate px-2 w-auto text-center cursor-pointer rounded-xl ${
                        activeLocation === location._id &&
                        "bg-gray-200 font-semibold shadow-2xl scale-110 shadow-cyan-500"
                      }`}
                    >
                      {location.title}
                    </div>
                  ))}
              </div>
              <div className="flex flex-row items-center justify-center space-x-2">
                {pageNumber.map((number) => (
                  <div
                    key={number}
                    className={`grid place-items-center transition-all duration-500 ease-in-out cursor-pointer hover:animate-pulse  bg-opacity-50 w-6 h-6 leading-6  text-white rounded-full 
                ${darkMode ? "bg-gray-300 text-blue-700" : "bg-gray-900"}
                ${currentpage == number && "bg-opacity-100 scale-125"}
             `}
                  >
                    <a
                      onClick={() => paginate(number)}
                      className="tracking-widest text-sm "
                    >
                      {number}
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-medium">Description:</h2>
              <textarea
                className=" w-full outline-none bg-transparent"
                placeholder="Your Trip description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </form>
          <button
            onClick={createPlan}
            className="bg-teal-400 px-1 py-2 w-full rounded-xl mt-2 font-bold text-lg hover:shadow-lg hover:shadow-fuchsia-300/50"
          >
            Create Plan
          </button>
        </div>
      </main>
    </div>
  );
}

export default UserTripPlans;
export const getServerSideProps = async (context) => {
  const email = context.query.id;

  const locationquery = `*[_type == "location"]{
     ...
    }`;
  const userquery = `*[_type == "author" && email == $email][0]{
      ...
  }`;
  const tripplansquery = `*[_type == "tripplans" && email == $email ]{
    ...
  }`;
  const location = await sanityClient.fetch(locationquery);
  const userInfo = await sanityClient.fetch(userquery, { email: email });
  const tripplans = await sanityClient.fetch(tripplansquery, {
    email: email,
  });

  return {
    props: { location, userInfo, tripplans },
  };
};