import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { sanityClient, urlFor } from "../../sanity";
import Map, { Marker } from "react-map-gl";
import { useRouter } from "next/router";
import "mapbox-gl/dist/mapbox-gl.css";
import { IoChevronUpOutline } from "react-icons/io5";
import Footer from "../../components/Footer";
import { AiTwotoneFire } from "react-icons/ai";
import toast from "react-hot-toast";
import { selectUser } from "../../features/userSlice";
import { useSelector } from "react-redux";
import { selectDarkmode } from "../../features/darkmodeSlice";

function PostDetails({ slug, post }) {
  const darkMode = useSelector(selectDarkmode);
  const topRef = useRef(null);
  const user = useSelector(selectUser);

  const [username, setUsername] = useState(user ? user?.username : "");
  const [email, setEmail] = useState(user ? user?.email : "");
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState({});
  const [rating, setRating] = useState([]);
  const [postRating, setPostRating] = useState(null);

  const [rate, setRate] = useState(null);
  const [comment, setComment] = useState("");
  const [refetchpost, setRefetchPost] = useState(post);
  const id = post?._id;

  const fetchRating = async () => {
    const query = `*[_type == "rating" && ratedPostId == $id]{
    ...
  }`;
    const rating = await sanityClient.fetch(query, {
      id: id,
    });
    setRating(rating);
  };

  useEffect(() => {
    if (id) {
      fetchRating();
    }
  }, [id]);

  const calcTotalRating = () => {
    const totalUserRate = rating?.length;

    let totalRating = 0;
    rating?.forEach((item) => {
      totalRating = totalRating + item.rating;
    });

    setPostRating(Number(totalRating / totalUserRate).toFixed(2));
  };

  const updatePostRating = async () => {
    const notification = toast.loading("Rate the post...");
    let totalRating = 0;
    rating?.forEach((item) => {
      totalRating = totalRating + item.rating;
    });
    const currentRating = Number(totalRating);
    const inputRating = Number(rate);
    const totalUserRate = Number(rating?.length) + Number(1);
    const finalRating = (currentRating + inputRating) / totalUserRate;

    const rateInfo = {
      _id: post?._id,
      rating: Number(finalRating),
    };

    try {
      await fetch(`/api/updatepostrating`, {
        body: JSON.stringify(rateInfo),
        method: "POST",
      }).then(() => {
        toast.success("Post Update Rate Success", {
          id: notification,
        });
      });
    } catch (error) {
      toast.error("You Already Rate This Post", {
        id: notification,
      });
    }
  };

  useEffect(() => {
    if (rating) {
      calcTotalRating();
    }
  }, [rating]);

  const coordinates = {
    longitude: Number(refetchpost.location.longitude),
    latitude: Number(refetchpost.location.latitude),
  };

  const [viewport, setViewport] = useState({
    longitude: coordinates?.longitude,
    latitude: coordinates?.latitude,
    zoom: 14,
    width: "100%",
    height: "100%",
  });

  const navlocation = () => {
    router.push(`/place/${refetchpost?.location._id}`);
  };

  const scrollToTop = () => {
    topRef.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  const rateThePost = async (e) => {
    e.preventDefault();
    const notification = toast.loading("Rate the post...");

    if (!user) {
      toast.error("Please Login to rate...");
    }
    if (!email) {
      toast.error("Email Must Include...");
    }
    const ratingTitle = refetchpost?.title.concat(
      "+",
      rate,
      "+",
      user ? user?.username : email
    );

    const rateInfo = {
      _id: refetchpost?._id,
      ratedUserName: user?.username,
      ratedUserEmail: user?.email,
      ratedUserId: user?.id,
      rating: rate,
      ratingTitle: ratingTitle,
      comment: comment,
    };

    if (rate > Number(5)) {
      toast.error("Maximum rating is 5", { id: notification });
      setRate(Number(5));
    }
    const userRatedThePost = rating?.find(
      (rating) => rating?.ratedUserEmail == email
    );

    if (!!userRatedThePost == false) {
      try {
        await fetch("/api/ratethepost", {
          body: JSON.stringify(rateInfo),
          method: "POST",
        }).then((res) => {
          toast.success("Rate Success", {
            id: notification,
          });
          fetchRating();
          updatePostRating();
        });
      } catch (error) {
        toast.error("Something Error", {
          id: notification,
        });
      }
    }
    if (!!userRatedThePost == true) {
      toast.error("You Already Rate This Post", {
        id: notification,
      });
    }

    setUsername("");
    setEmail("");
    setComment("");
    setRate(Number(0));
    fetchRating();
  };

  return (
    <div
      className={`${
        darkMode ? "page-bg-dark text-white" : "bg-std text-black"
      }`}
      ref={topRef}
    >
      <Head>
        <title>Zong Hong PhotoTravel Map ||{refetchpost.title} </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-screen mx-auto">
        <div className="flex flex-col">
          <div className="w-full mb-4 flex flex-col items-center justify-center">
            {refetchpost?.mainImage && (
              <Image
                src={urlFor(refetchpost?.mainImage).url()}
                className={"w-full rounded-lg cursor-pointer"}
                width={700}
                height={700}
                objectFit="contain"
              />
            )}
            <div className="p-4 w-full">
              <h1 className="test-center font-bold text-xl">
                {refetchpost.title}
              </h1>
              <div className=" grid grid-flow-row-dense grid-cols-4">
                {refetchpost?.categories?.map((category, idx) => (
                  <div
                    onClick={() =>
                      router.push(`/category/${category?.slug?.current}`)
                    }
                    key={idx}
                    className="hover:underline cursor-pointer"
                  >
                    <p className="font-semibold text-gray-400 italic text-sm">
                      {category?.slug?.current}
                    </p>
                  </div>
                ))}
              </div>
              <p
                onClick={navlocation}
                className="hover:underline cursor-pointer"
              >
                {refetchpost.location.title}
              </p>
              <p>{refetchpost.location.address}</p>
              {postRating > 0 ? (
                <div className="flex items-center space-x-1">
                  <p>{postRating}</p>
                  <AiTwotoneFire className=" w-4 h-4 text-red-500/80" />
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <p className="text-gray-400 italic">No Rating Yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-4">
          <form
            className={`flex flex-col bg-opacity-10 shadow-md  rounded-md backdrop-filter backdrop-blur-3xl cursor-pointer px-2 py-4 hover:shadow-md w-full h-full ${
              darkMode
                ? "bg-gray-100 text-white hover:shadow-cyan-500/40 hover:shadow-lg"
                : " bg-white text-black hover:shadow-2xl"
            }`}
          >
            <h2 className="text-3xl font-bold text-center">Rate Me</h2>
            <div className="flex flex-row items-center space-x-2">
              <h2 className="font-medium text-lg">Username:</h2>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={`${user ? `${user?.username}` : "Username"}`}
                className="flex-1 bg-transparent px-2 py-2 rounded-xl outline-none font-bold"
                type="email"
              />
            </div>
            <div className="flex flex-row items-center space-x-2">
              <h2 className="font-medium text-lg">Email:</h2>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`${user ? `${user?.email}` : "Email"}`}
                className="flex-1 bg-transparent px-2 py-2 rounded-xl outline-none font-bold"
                type="email"
              />
            </div>
            <div className="flex flex-row items-center space-x-2">
              <h2 className="font-medium text-lg">Rate:</h2>
              <input
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder={"Please Rate Me"}
                className="flex-1 bg-transparent px-2 py-2 rounded-xl outline-none font-bold"
                type="number"
                min="0"
                max="5"
              />
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-4 bg-transparent px-2 py-2 rounded-xl h-44 outline-none"
              placeholder="Please Comment (optional)"
            />
            <button
              disabled={!user || rate == null || !email}
              onClick={rateThePost}
              className="bg-red-300 text-white font-bold px-2 py-1 rounded-xl"
            >
              Submit Rating
            </button>
          </form>
        </div>

        <div className="my-4">
          <h2 className="text-3xl font-bold text-center">My Map</h2>
        </div>
        <div id="#map" className="relative flex items-center justify-center">
          <Map
            {...viewport}
            onMove={(evt) => setViewport(evt.viewport)}
            style={{ width: "100vw", height: "50vh" }}
            mapStyle="mapbox://styles/zonghong/cks1a85to4kqf18p6zuj5zdx6"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
          >
            <Marker
              longitude={Number(refetchpost.location.longitude)}
              latitude={Number(refetchpost.location.latitude)}
              color="red"
              onClick={() => setSelectedLocation(refetchpost)}
            >
              <div
                onClick={() =>
                  setSelectedLocation(refetchpost.location.longitude)
                }
                className="w-12 text-center  text-white  cursor-pointer"
              >
                {refetchpost.mainImage && (
                  <Image
                    layout="fixed"
                    width={100}
                    height={100}
                    src={urlFor(refetchpost.mainImage).url()}
                    alt="img"
                    objectFit="contain"
                    className=""
                  />
                )}
              </div>
            </Marker>
          </Map>
          <div
            onClick={scrollToTop}
            className="w-12 h-12 bg-green-500 group hover:bg-green-700 flex items-center justify-center rounded-full absolute -bottom-4 bg-opacity-30 cursor-pointer "
          >
            <IoChevronUpOutline className="w-6 h-6 text-white hover:text-green-100" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PostDetails;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
          _id,
          slug {
              current
          } 
        }`;
  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    author->{
      name,
      image
    },
      description,
      mainImage,
      slug,
      categories[]->{
        ...
      },
      rating[]->{
        ...
      },
      location->{
     ...
      }  
    }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post: post,
    },
    revalidate: 60,
  };
};
