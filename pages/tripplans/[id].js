import React, { useState, useRef } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { sanityClient } from "../../sanity";
import { fetchlocation } from "../../utils/fetchlocation";
import { fetchtripplans } from "../../utils/fetchtripplans";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { selectDarkmode } from "../../features/darkmodeSlice";
import {
  closeLocationModal,
  openLocationModal,
  selectLocationModalIsOpen,
} from "../../features/modalSlice";
import {
  AiOutlinePlusCircle,
  AiOutlineClose,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";
const PlanList = dynamic(() => import("../../components/PlanList"));
const AddLocationModal = dynamic(() =>
  import("../../components/AddLocationModal")
);
import toast from "react-hot-toast";

function UserTripPlans({ location, userInfo, tripplans }) {
  const scrollbarRef = useRef(null);
  const router = useRouter();
  const id = router.query.id;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const darkMode = useSelector(selectDarkmode);
  const locationModalisOpen = useSelector(selectLocationModalIsOpen);
  const [selectlocation, setSelectLocation] = useState(null);
  const [activeLocation, setActiveLocation] = useState(selectlocation);
  const [title, setTitle] = useState("");
  const [tripDate, setTripDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [refetchLocation, setRefetchLocation] = useState(location);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchLocationResult, setSearchLocationResult] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const excludeColumns = [];
  const [currentpage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const indexOfLastPost = currentpage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentLocation = refetchLocation?.slice(
    indexOfFirstPost,
    indexOfLastPost
  );
  const [plans, setPlans] = useState(tripplans);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(refetchLocation?.length / postsPerPage); i++) {
    pageNumber.push(i);
  }

  const handleChange = (value) => {
    setSearchLocation(value);
    filterData(value);
  };

  const handleRefreshPlan = async () => {
    const refresnToast = toast.loading("Refreshing Plans...");

    await fetchtripplans(id).then((plans) => {
      console.log(plans);
      setPlans(plans);
    });

    toast.success("Plans Updated", { id: refresnToast });
  };

  const filterData = (value) => {
    const Value = value.toLocaleUpperCase().trim();
    if (Value === "") {
      setSearchLocationResult(refetchLocation);
      setShowResults(false);
    } else {
      setShowResults(true);
      const filteredData = refetchLocation.filter((item) => {
        return Object.keys(item).some((key) =>
          excludeColumns.includes(key)
            ? false
            : item[key]?.toString().toLocaleUpperCase().includes(Value)
        );
      });
      setSearchLocationResult(filteredData);
    }
  };

  const refreshAllLocation = async () => {
    const refresnToast = toast.loading("Refreshing Location...");
    await fetchlocation().then((location) => {
      setRefetchLocation(location);
    });
    toast.success("Location Updated", { id: refresnToast });
  };

  const openlocationModal = () => {
    if (!locationModalisOpen) {
      dispatch(openLocationModal());
    } else {
      dispatch(closeLocationModal());
    }
  };
  const refeshAll = () => {
    handleRefreshPlan();
    refreshAllLocation();
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
        refeshAll();
      });
    } catch (err) {
      toast.error("Something went wrong", {
        id: notification,
      });
    }
  };
  const scroll = (scrollOffset) => {
    scrollbarRef.current.scrollLeft += scrollOffset;
  };

  return (
    <div
      className={` ${
        darkMode ? "page-bg-dark text-white" : "bg-std text-black"
      }`}
    >
      <Head>
        <title>
          Zong Hong PhotoTravel Map || {user?.email} Create Travel Plan
        </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full h-screen overflow-hidden flex-1 flex-col lg:flex-row">
        <div className="w-full lg:w-[50vw] p-4 ">
          <div className="flex flex-row items-center justify-center space-x-2">
            <h1 className="text-center my-4 text-xl lg:text-3xl">
              Your Plan List
            </h1>
            <BiRefresh
              onClick={handleRefreshPlan}
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
          <div className="flex flex-row items-center justify-center space-x-2 w-full">
            <h1 className="text-center my-4 text-xl lg:text-3xl">Trip Plan </h1>
            <BiRefresh
              onClick={refreshAllLocation}
              className=" text-blue-500 h-6 w-6 cursor-pointer text-twitterBlue transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
            />
          </div>
          <div
            className={`${
              darkMode
                ? "bg-gray-100 text-white"
                : " bg-white text-black hover:shadow-2xl"
            } space-y-4 mt-2  bg-opacity-10 shadow-md  rounded-md backdrop-filter backdrop-blur-3xl cursor-pointer px-2 py-4 w-full`}
          >
            <div className="flex items-center space-x-1">
              <h2>Title:</h2>
              <p>{title}</p>
            </div>
            <div className="flex items-center space-x-1">
              <h2>Trip Date:</h2>
              {tripDate && <p>{tripDate?.toString()}</p>}
            </div>
            <div className="flex items-center space-x-1">
              <h2>Location:</h2>
              {selectlocation && <p>{selectlocation?.title}</p>}
            </div>
            <div className="flex items-center space-x-1">
              <h2>Description:</h2>
              <p>{description}</p>
            </div>
          </div>
          <form
            className={`${
              darkMode
                ? "bg-gray-100 text-white  hover:shadow-lg"
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
              <div className="flex flex-row items-center space-x-2">
                <h2 className="text-lg font-medium">Trip Date:</h2>
              </div>
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
              <div className="w-full h-[20vh] lg:h-[15vh] scrollbar-hide overflow-y-scroll grid grid-flow-row-dense grid-cols-2 lg:grid-cols-3 gap-9 p-10 ">
                {showResults &&
                  searchLocationResult?.map((location) => (
                    <div
                      key={location._id}
                      value={location._id}
                      onClick={() => {
                        setSelectLocation(location);
                        setActiveLocation(location._id);
                      }}
                      className={`bg-std h-fit text-black transition-all duration-500  ease-in-out flex items-center justify-center min-h-12 overflow-hidden truncate px-2 w-auto text-center cursor-pointer rounded-xl ${
                        activeLocation === location._id &&
                        "bg-gray-200  scale-110 shadow-fuchsia-500 ring-1 ring-fuchsia-500"
                      }`}
                    >
                      <p>{location.title}</p>
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
                      className={`bg-std h-fit text-black transition-all duration-500  ease-in-out flex items-center justify-center min-h-12 overflow-hidden truncate px-2 w-auto text-center cursor-pointer rounded-xl ${
                        activeLocation === location._id &&
                        "bg-gray-200  shadow-2xl scale-110 shadow-fuchsia-500 ring-1 ring-fuchsia-500"
                      }`}
                    >
                      <p>{location.title}</p>
                    </div>
                  ))}
              </div>
              <div className="flex flex-row items-center justify-between mb-4 w-full px-2">
                <AiOutlineLeft
                  onClick={() => scroll(-200)}
                  className="w-5 h-5 cursor-pointer text-cyan-400"
                />
                <div
                  ref={scrollbarRef}
                  className="scroll-smooth h-12 flex flex-row items-center justify-between space-x-4 lg:space-x-1 w-full overflow-x-scroll scrollbar-hide"
                >
                  {pageNumber.map((number) => (
                    <div
                      onClick={() => paginate(number)}
                      key={number}
                      className={`w-6  h-6 flex items-center justify-center transition-all duration-500 ease-in-out cursor-pointer hover:animate-pulse  bg-opacity-50 text-white rounded-full 
                ${darkMode ? "bg-gray-300 text-blue-700" : "bg-gray-900"}
                ${currentpage == number && "bg-opacity-100 scale-125"}
             `}
                    >
                      <a className="tracking-widest text-sm m-4">{number}</a>
                    </div>
                  ))}
                </div>
                <AiOutlineRight
                  onClick={() => scroll(200)}
                  className="w-5 h-5 cursor-pointer text-cyan-400"
                />
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
            disabled={!title || !tripDate || !selectlocation}
            onClick={createPlan}
            className="bg-teal-400 disabled:bg-opacity-50 px-1 py-2 w-full rounded-xl mt-2 font-bold text-lg hover:shadow-lg hover:shadow-fuchsia-300/50"
          >
            Create Plan
          </button>
        </div>
      </main>
      {locationModalisOpen && <AddLocationModal handleRefresh={refeshAll} />}
    </div>
  );
}

export default UserTripPlans;

export const getServerSideProps = async (context) => {
  const email = context.query.id;
  const userquery = `*[_type == "author" && email == $email][0]{
      ...
  }`;

  const location = await fetchlocation();
  const userInfo = await sanityClient.fetch(userquery, { email: email });
  const tripplans = await fetchtripplans(email);

  return {
    props: { location, userInfo, tripplans },
  };
};
