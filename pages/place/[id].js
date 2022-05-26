import React, { useState } from "react";
import { sanityClient, urlFor } from "../../sanity";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getCenter } from "geolib";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, Popup } from "react-map-gl";
const PostFeeds = dynamic(() => import("../../components/PostFeeds"));

function PlaceDetail({ posts }) {
  const router = useRouter();
  const coordinates = posts.map((result) => ({
    longitude: result?.location?.longitude,
    latitude: result?.location?.latitude,
  }));
  const [selectedLocation, setSelectedLocation] = useState({});
  const center = getCenter(coordinates);
  const [viewport, setViewport] = useState({
    longitude: center?.longitude,
    latitude: center?.latitude,
    zoom: 3.5,
    width: "100%",
    height: "100%",
  });
  return (
    <div>
      <main className="max-w-screen mx-auto">
        <div className="grid grid-flow-row-dense grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3 xl:grid-cols-4">
          {posts?.map((post) => (
            <PostFeeds
              key={post._id}
              title={post.title}
              author={post.author}
              slug={post.slug}
              mainImage={post.mainImage}
              categories={post.categories}
              publishedAt={post.publishedAt}
              location={post.location}
              body={post.body}
            />
          ))}
        </div>
        <div className="flex items-center justify-center">
          <Map
            {...viewport}
            onMove={(evt) => setViewport(evt.viewport)}
            style={{ width: "100vw", height: "100vh" }}
            mapStyle="mapbox://styles/zonghong/cks1a85to4kqf18p6zuj5zdx6"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
          >
            {posts.map((post) => (
              <div key={post._id}>
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
                    <Image
                      layout="fixed"
                      width={60}
                      height={60}
                      src={urlFor(post.mainImage).url()}
                      alt="img"
                      objectFit="contain"
                      className=""
                    />
                  </div>
                </Marker>
                {selectedLocation === post.location.longitude ? (
                  <div>
                    <Popup
                      closeOnClick={false}
                      onClose={() => setSelectedLocation({})}
                      latitude={post.location.latitude}
                      longitude={post.location.longitude}
                    >
                      <div
                        onClick={() =>
                          router.push(`/post/${post.slug.current}`)
                        }
                        className="cursor-pointer"
                      >
                        <p className="font-bold hover:underline">
                          {post.title}
                        </p>
                      </div>
                    </Popup>
                  </div>
                ) : (
                  false
                )}
              </div>
            ))}
          </Map>
        </div>
      </main>
    </div>
  );
}

export default PlaceDetail;
export const getServerSideProps = async (context) => {
  const id = context.query.id;
  console.log("getServerSideProps id", id);

  const query = `*[_type == "post" && location._ref == $id ]{
    _id,
    title,
    author->{
      _id,
      ...,
    },
    slug,
    publishedAt,
    categories[0]->{
      _id,
      ...,
    },
    mainImage,
    location->{
      _id,
      ...,
    },
  }| order(_createdAt desc)`;
  const posts = await sanityClient.fetch(query, { id: id });

  return {
    props: {
      posts,
    },
  };
};
