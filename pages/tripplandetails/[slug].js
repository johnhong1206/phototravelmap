import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectDarkmode } from "../../features/darkmodeSlice";
import {
  closeLocationModal,
  openLocationModal,
  selectLocationModalIsOpen,
} from "../../features/modalSlice";
import { selectUser } from "../../features/userSlice";
import { sanityClient } from "../../sanity";
import { AiOutlinePlusCircle, AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import { BiRefresh } from "react-icons/bi";

function Plandetails({ plan, location, params }) {
  const darkMode = useSelector(selectDarkmode);
  const user = useSelector(selectUser);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [thingstodo, setThingstodo] = useState("");
  const locationModalisOpen = useSelector(selectLocationModalIsOpen);
  const [selectlocation, setSelectLocation] = useState(null);
  const [activeLocation, setActiveLocation] = useState(selectlocation);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchLocationResult, setSearchLocationResult] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const excludeColumns = [];
  const [currentpage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const indexOfLastPost = currentpage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const [plans, setPlans] = useState(plan);
  const currentLocation = location?.slice(indexOfFirstPost, indexOfLastPost);
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
  const refreshPlan = async () => {
    const refresnToast = toast.loading("Refreshing Plan...");

    const query = `*[_type == "tripplans" && slug.current == $slug][0]{
    ...,
    location->{
        ...
      },
      tripDetails[]->{
        ...,
        location->{
            ...
          },
      },
    }
    `;
    const plan = await sanityClient.fetch(query, {
      slug: params?.slug,
    });
    setPlans(plan);
    toast.success("Plan Updated", { id: refresnToast });
  };

  const addPlan = async (e) => {
    const notification = toast.loading("Updating Plan...");
    const planInfo = {
      title: title,
      email: user?.email,
      referenceTripPlan: plans?._id,
      date: new Date().toISOString(),
      time: time?.toString(),
      location: selectlocation?._id,
      thingstodo: thingstodo,
    };
    try {
      await fetch(`/api/addtripplan`, {
        body: JSON.stringify(planInfo),
        method: "POST",
      }).then((res) => {
        console.log(res);
        toast.success("Update Plan Success", {
          id: notification,
        });
        refreshPlan();
        setTitle("");
        setTime("");
        setSelectLocation(null);
        setThingstodo("");
      });
    } catch (error) {
      toast.error("Something Error", {
        id: notification,
      });
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "page-bg-dark text-white" : "bg-std text-black"
      }`}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row items-center space-x-2">
          <h1 className="text-3xl text-center">{plans?.title}</h1>
          <BiRefresh
            onClick={refreshPlan}
            className=" text-blue-500 h-6 w-6 cursor-pointer text-twitterBlue transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
          />
        </div>

        <div className="flex flex-row items-center space-x-2">
          <p className="text-base text-stone-400">
            {new Date(plans?.tripDate).toDateString()}
          </p>
          <p>{plans?.location?.title}</p>
        </div>
      </div>

      <main className="my-4 flex flex-col lg:flex-row mx-auto max-w-screen">
        <div className="felx flex-row flex-grow w-full overflow-y-scroll scrollbar-hide h-full lg:h-[80vh]">
          {!!plans &&
            plans?.tripDetails?.map((tripDetail) => (
              <div key={tripDetail?._id} className="my-3">
                <div className="flex flex-row items-baseline justify-between space-x-2 px-2">
                  <div>
                    <div className="flex flex-row items-center space-x-2">
                      <div className="bg-teal-400 h-2 w-2 rounded-full" />
                      <p>{tripDetail?.time}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end flex-grow">
                    <div>
                      <h2>{tripDetail?.title}</h2>
                    </div>
                    <div className="flex">
                      <p>{tripDetail?.location?.title}</p>
                    </div>
                    <div>
                      <p>{tripDetail?.thingstodo}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start ml-10 space-y-2 ">
                  <div className="bg-teal-300 h-1 w-1 bg-opacity-80 rounded-full" />
                  <div className="bg-teal-300 h-1 w-1 bg-opacity-80 rounded-full" />
                  <div className="bg-teal-300 h-1 w-1 bg-opacity-80 rounded-full" />
                </div>
                <div className="pb-2" />
              </div>
            ))}
          {title && selectlocation && time && (
            <div className="my-3">
              <div className="flex flex-row items-baseline justify-between space-x-2 px-2">
                <div>
                  <div className="flex flex-row items-center space-x-2">
                    <div className="bg-teal-400 h-2 w-2 rounded-full" />
                    <p>{time}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end flex-grow">
                  <div>
                    <h2>{title}</h2>
                  </div>
                  <div className="flex">
                    <p>{selectlocation.title}</p>
                  </div>
                  <div>
                    <p>{thingstodo}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start ml-10 space-y-2 ">
                <div className="bg-teal-300 h-1 w-1 bg-opacity-80 rounded-full" />
                <div className="bg-teal-300 h-1 w-1 bg-opacity-80 rounded-full" />
                <div className="bg-teal-300 h-1 w-1 bg-opacity-80 rounded-full" />
              </div>
              <div className="pb-2" />
            </div>
          )}
          <div className="my-3">
            <h2>Day End</h2>
          </div>
        </div>
        <div className="w-full flex flex-col p-4 items-center justify-center">
          <h1 className="text-3xl text-center">Add Plan</h1>
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
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center space-x-2">
              <h2 className="text-lg font-medium">time:</h2>
              <input
                type="time"
                value={time}
                className="text-base text-white placeholder:text-blue-400  w-full outline-none h-8 bg-transparent"
                onChange={(e) => setTime(e.target.value)}
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
                placeholder="Thing to do..."
                value={thingstodo}
                onChange={(e) => setThingstodo(e.target.value)}
              />
            </div>
          </form>
          <button
            onClick={addPlan}
            className="bg-teal-400 px-1 py-2 w-full rounded-xl mt-2 font-bold text-lg hover:shadow-lg hover:shadow-fuchsia-300/50"
          >
            Add Plan
          </button>
        </div>
      </main>
      <div className="pb-1" />
    </div>
  );
}

export default Plandetails;
export const getStaticPaths = async () => {
  const query = `*[_type == "tripplans"]{
            _id,
            slug {
                current
            } 
          }`;
  const plan = await sanityClient.fetch(query);

  const paths = plan.map((plan) => ({
    params: {
      slug: plan.slug.current,
    },
  }));

  return { paths, fallback: "blocking" };
};
export const getStaticProps = async ({ params }) => {
  const query = `*[_type == "tripplans" && slug.current == $slug][0]{
...,
location->{
    ...
  },
  tripDetails[]->{
    ...,
    location->{
        ...
      },
  },
}
`;
  const locationquery = `*[_type == "location"]{
    ...
   }`;
  const location = await sanityClient.fetch(locationquery);

  const plan = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!plan) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      plan: plan,
      params: params,
      location: location,
    },
    revalidate: 60,
  };
};
