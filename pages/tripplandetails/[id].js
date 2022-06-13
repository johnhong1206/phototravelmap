import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
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
import { BiMapPin } from "react-icons/bi";
import { IoRestaurantOutline } from "react-icons/io5";
import { RiHotelLine } from "react-icons/ri";
import { MdOutlineTour, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FaRegGem, FaRegGrinBeam } from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";
import Head from "next/head";
import { useRouter } from "next/router";
const TripDetailsMap = dynamic(() => import("../../components/TripDetailsMap"));

import AddLocationModal from "../../components/AddLocationModal";
import { getAreaInfo } from "../../features/placeinfoSlice";

function Plandetails({ plan, location, tripdetails }) {
  const router = useRouter();
  const id = router.query.id;
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkmode);
  const user = useSelector(selectUser);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date(plans?.tripDate).toDateString());
  const [time, setTime] = useState("");
  const [thingstodo, setThingstodo] = useState("");
  const locationModalisOpen = useSelector(selectLocationModalIsOpen);
  const [refetchLocation, setRefetchLocation] = useState(location);
  const [refetchTripDetails, setRefetchTripDetails] = useState(tripdetails);
  const [initalLocationState, setInitalLocationState] = useState(true);
  const [activeNumber, setActiveNumber] = useState("");
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
  const [plans, setPlans] = useState(plan[0]);
  const [queryOption, setQueryOption] = useState("");

  const currentLocation = refetchLocation?.slice(
    indexOfFirstPost,
    indexOfLastPost
  );
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
  const openlocationModal = () => {
    if (!locationModalisOpen) {
      dispatch(openLocationModal());
    } else {
      dispatch(closeLocationModal());
    }
  };

  const refreshPlan = async () => {
    const refresnToast = toast.loading("Refreshing Plan...");

    const tripplandettailsquery = `*[_type == "tripDetails" && referenceTripPlan == $id]{
      ...,
      location->{
        ...
      },
     }| order(_createdAt asc)`;
    const tripdetails = await sanityClient.fetch(tripplandettailsquery, {
      id: id,
    });
    setRefetchTripDetails(tripdetails);
    toast.success("Plan Updated", { id: refresnToast });
  };

  const addPlan = async (e) => {
    const notification = toast.loading("Updating Plan...");
    const planInfo = {
      title: title,
      email: user?.email,
      referenceTripPlan: id,
      date: date,
      time: time?.toString(),
      location: selectlocation?._id,
      thingstodo: thingstodo,
    };
    if (!title) {
      toast.error("Please provide a title"), { id: notification };
      return false;
    }

    if (!time) {
      toast.error("Please provide a time"), { id: notification };
      return false;
    }
    if (!selectlocation?._id) {
      toast.error("Please provide a location"), { id: notification };
      return false;
    }
    try {
      await fetch(`/api/addtripplan`, {
        body: JSON.stringify(planInfo),
        method: "POST",
      }).then((res) => {
        toast.success("Update Plan Success", {
          id: notification,
        });
        refreshPlan();
        setTitle("");
        setTime("");
        setSelectLocation(null);
        setThingstodo("");
        setActiveLocation("");
      });
    } catch (error) {
      toast.error("Something Error", {
        id: notification,
      });
    }
  };

  const getInfo = async () => {
    const refresnToast = toast.loading(
      `Getting ${plans?.location?.title} area info`
    );

    var requestOptions = {
      method: "GET",
    };
    const queryOptionUrl = `https://api.geoapify.com/v2/places?categories=${queryOption.toString()}&filter=circle:${
      plans?.location?.longitude
    },${plans?.location?.latitude},10000&bias=proximity:${
      plans?.location?.longitude
    },${plans?.location?.latitude}&limit=50&apiKey=${
      process.env.NEXT_PUBLIC_GEOAPIFY_KEY
    }`;
    const defaultUrl = `https://api.geoapify.com/v2/places?categories=catering,tourism,heritage,accommodation,entertainment&filter=circle:${plans?.location?.longitude},${plans?.location?.latitude},10000&bias=proximity:${plans?.location?.longitude},${plans?.location?.latitude}&limit=50&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`;

    const url = queryOption ? queryOptionUrl : defaultUrl;

    await fetch(url, requestOptions)
      .then((response) => response.json())
      .then((responseData) => {
        dispatch(getAreaInfo(responseData));
        toast.success(
          `${plans?.location?.title} area info updated successfully`,
          {
            id: refresnToast,
          }
        );
      })
      .catch((error) => console.log("error", error));
  };

  const refreshAllLocation = async () => {
    const refresnToast = toast.loading("Refreshing Location...");
    const locationquery = `*[_type == "location"]{
      ...
     }| order(_createdAt desc)`;
    const location = await sanityClient.fetch(locationquery);
    setRefetchLocation(location);
    toast.success("Location Updated", { id: refresnToast });
  };

  const handleRefresh = () => {
    refreshPlan().then(() => {
      refreshAllLocation();
    });
  };

  useEffect(() => {
    if (refetchTripDetails.length > 0) {
      setInitalLocationState(false);
    } else {
      setInitalLocationState(true);
    }
  }, [refetchTripDetails]);

  console.log(searchLocationResult);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "page-bg-dark text-white" : "bg-std text-black"
      }`}
    >
      <Head>
        <title>Zong Hong PhotoTravel Map || {plans?.title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row items-center space-x-2">
          <h1 className="text-3xl text-center">{plans?.title}</h1>
          <BiRefresh
            onClick={handleRefresh}
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
          {!!refetchTripDetails &&
            refetchTripDetails?.map((tripDetail) => (
              <div key={tripDetail?._id} className="my-3">
                <div className="flex flex-row items-baseline justify-between space-x-2 px-2">
                  <div>
                    <div className="flex flex-row items-center space-x-2">
                      <div className="bg-teal-400 h-2 w-2 rounded-full" />
                      <div className="flex flex-col">
                        <p>{new Date(tripDetail?.date).toDateString()}</p>
                        <p>{tripDetail?.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end flex-grow">
                    <div>
                      <h2>{tripDetail?.title}</h2>
                    </div>
                    <div className="flex space-x-3">
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
                    <div className="flex flex-col">
                      <p>{date}</p>
                      <p>{time}</p>
                    </div>
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
            <h2>Trip End</h2>
          </div>
        </div>
        <div className="w-full flex flex-col p-4 items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <h1 className="text-3xl text-center">Add Plan</h1>
            <div className="flex items-center justify-center space-x-4 w-full">
              <IoRestaurantOutline
                className={`w-5 h-5 transition-all duration-500  ease-in-out cursor-pointer text-yellow-400 ${
                  queryOption === "catering" && "scale-125"
                }`}
                onClick={() => setQueryOption("catering")}
              />
              <RiHotelLine
                className={`w-5 h-5 transition-all duration-500  ease-in-out cursor-pointer text-cyan-400  ${
                  queryOption === "accommodation" && "scale-125"
                }`}
                onClick={() => setQueryOption("accommodation")}
              />
              <MdOutlineTour
                className={`w-5 h-5 transition-all duration-500  ease-in-out cursor-pointer text-fuchsia-400 ${
                  queryOption === "tourism" && "scale-125"
                }`}
                onClick={() => setQueryOption("tourism")}
              />
              <FaRegGem
                className={`w-5 h-5 transition-all duration-500  ease-in-out cursor-pointer text-red-400 ${
                  queryOption === "heritage" && "scale-125"
                }`}
                onClick={() => setQueryOption("heritage")}
              />
              <FaRegGrinBeam
                className={`w-5 h-5 transition-all duration-500  ease-in-out cursor-pointer text-purple-400 ${
                  queryOption === "entertainment" && "scale-125"
                }`}
                onClick={() => setQueryOption("entertainment")}
              />
            </div>
            <button
              onClick={getInfo}
              className="w-full bg-cyan-800 px-1 py-2 rounded-xl"
            >
              Click for {queryOption} Info
            </button>
          </div>
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
                type="date"
                value={date}
                className="text-base text-white placeholder:text-blue-400  w-full outline-none h-8 bg-transparent"
                onChange={(e) => setDate(e.target.value)}
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
              <div className="h-[20vh] lg:h-[15vh] scrollbar-hide overflow-y-scroll grid grid-flow-row-dense grid-cols-2 lg:grid-cols-3 gap-4 p-10 ">
                {showResults &&
                  searchLocationResult?.map((location) => (
                    <div
                      key={location._id}
                      value={location._id}
                      onClick={() => {
                        setSelectLocation(location);
                        setActiveLocation(location._id);
                      }}
                      className={`bg-std h-8 text-black transition-all duration-500  ease-in-out flex items-center justify-center min-h-12 overflow-hidden truncate px-2 w-auto text-center cursor-pointer rounded-xl ${
                        activeLocation === location._id &&
                        "bg-gray-200  scale-110 shadow-fuchsia-500 ring-1 ring-fuchsia-500"
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
                      className={`bg-std h-8 text-black transition-all duration-500  ease-in-out flex items-center justify-center min-h-12 overflow-hidden truncate px-2 w-auto text-center cursor-pointer rounded-xl ${
                        activeLocation === location._id &&
                        "bg-gray-200  scale-110 shadow-fuchsia-500 ring-1 ring-fuchsia-500"
                      }`}
                    >
                      {location.title}
                    </div>
                  ))}
              </div>
              <div className="flex flex-row items-center justify-center space-x-2 my-2">
                {pageNumber.map((number) => (
                  <div
                    onClick={() => {
                      setActiveNumber(number);
                      paginate(number);
                    }}
                    key={number}
                    className={`bg-std text-black transition-all duration-500  ease-in-out flex items-center justify-center min-h-12 overflow-hidden truncate px-2 w-auto text-center cursor-pointer rounded-xl ${
                      activeNumber == number &&
                      "bg-gray-200  scale-110 shadow-fuchsia-500 ring-1 ring-fuchsia-500"
                    }`}
                  >
                    <a className="tracking-widest text-sm ">{number}</a>
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
            disabled={!user || !selectlocation || !time}
            onClick={addPlan}
            className="bg-teal-400 px-1 py-2 w-full rounded-xl mt-2 font-bold text-lg hover:shadow-lg hover:shadow-fuchsia-300/50"
          >
            Add Plan
          </button>
        </div>
      </main>

      <TripDetailsMap
        initalLocationState={initalLocationState}
        location={refetchTripDetails}
        currentLocation={plans?.location}
        plans={plans}
      />

      <div className="pb-1" />
      {locationModalisOpen && (
        <AddLocationModal handleRefresh={handleRefresh} />
      )}
    </div>
  );
}

export default Plandetails;

export const getServerSideProps = async (context) => {
  const id = context.query.id.toString();
  const tripplanquery = `*[_type == "tripplans" && _id == $id]{
    ...,
    location->{
      ...
    },
   }| order(_createdAt desc)`;
  const tripplandettailsquery = `*[_type == "tripDetails" && referenceTripPlan == $id]{
    ...,
    location->{
      ...
    },
   }| order(_createdAt asc)`;
  const locationquery = `*[_type == "location"]{
    ...
   }| order(_createdAt desc)`;
  const plan = await sanityClient.fetch(tripplanquery, { id: id });
  const tripdetails = await sanityClient.fetch(tripplandettailsquery, {
    id: id,
  });
  const location = await sanityClient.fetch(locationquery);
  return {
    props: {
      plan,
      tripdetails,
      location,
    },
  };
};

// export const getStaticProps = async ({ params }) => {
//   const query = `*[_type == "tripplans" && slug.current == $slug][0]{
// ...,
// location->{
//     ...
//   },
//   tripDetails[]->{
//     ...,
//     location->{
//         ...
//       },
//   },
// }
// `;
//   const locationquery = `*[_type == "location"]{
//   ...
//  }| order(_createdAt desc)`;

//   const planDetailQuery = `*[_type == "tripDetails" && referenceTripPlan == $id]{
//   ...,
//   location->{
//       ...
//     },
//     tripDetails[]->{
//       ...,
//       location->{
//           ...
//         },
//     },
//   }
// | order(_createdAt desc)`;

//   const location = await sanityClient.fetch(locationquery);

//   const plan = await sanityClient.fetch(query, {
//     slug: params?.slug,
//   });
//   // const planDetails = await sanityClient.fetch(planDetailQuery, {
//   //   id: params?.id,
//   // });
//   const id = params?.id;
//   console.log(params?.id);

//   if (!plan) {
//     return {
//       notFound: true,
//     };
//   }
//   return {
//     props: {
//       plan: plan,
//       params: params,
//       location: location,
//       // planDetails: planDetails,
//       // id: id,
//     },
//     revalidate: 60,
//   };
// };
