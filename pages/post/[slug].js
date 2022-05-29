import React, { useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { sanityClient, urlFor } from "../../sanity";
import Map, { Marker } from "react-map-gl";
import { useRouter } from "next/router";
import "mapbox-gl/dist/mapbox-gl.css";
import { IoChevronUpOutline } from "react-icons/io5";
import Footer from "../../components/Footer";

function PostDetails({ slug, post }) {
  const topRef = useRef(null);

  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState({});

  const coordinates = {
    longitude: Number(post.location.longitude),
    latitude: Number(post.location.latitude),
  };

  const [viewport, setViewport] = useState({
    longitude: coordinates?.longitude,
    latitude: coordinates?.latitude,
    zoom: 14,
    width: "100%",
    height: "100%",
  });

  const navlocation = () => {
    router.push(`/place/${post.location._id}`);
  };

  const scrollToTop = () => {
    topRef.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div ref={topRef}>
      <Head>
        <title>Zong Hong PhotoTravel Map ||{post.title} </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-screen mx-auto">
        <div className="flex flex-col">
          <div className="w-full mb-4 flex flex-col items-center justify-center">
            {post?.mainImage && (
              <Image
                src={urlFor(post?.mainImage).url()}
                className={"w-full rounded-lg cursor-pointer"}
                width={700}
                height={700}
                objectFit="contain"
              />
            )}
            <div className="p-4 w-full">
              <h1 className="test-center font-bold text-xl">{post.title}</h1>
              <div className=" grid grid-flow-row-dense grid-cols-4">
                {post?.categories?.map((category, idx) => (
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
                {post.location.title}
              </p>
              <p>{post.location.address}</p>
            </div>
          </div>
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
              longitude={Number(post.location.longitude)}
              latitude={Number(post.location.latitude)}
              color="red"
              onClick={() => setSelectedLocation(post)}
            >
              <div
                onClick={() => setSelectedLocation(post.location.longitude)}
                className="w-12 text-center  text-white  cursor-pointer"
              >
                {post.mainImage && (
                  <Image
                    layout="fixed"
                    width={100}
                    height={100}
                    src={urlFor(post.mainImage).url()}
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
