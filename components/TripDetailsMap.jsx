import React, { useState, useRef } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { getCenter } from "geolib";
import "mapbox-gl/dist/mapbox-gl.css";

function TripDetailsMap({ location }) {
  const coordinates = location?.map((result) => ({
    longitude: result?.location?.longitude,
    latitude: result?.location?.latitude,
  }));

  const center = getCenter(coordinates);
  const [viewport, setViewport] = useState({
    longitude: center?.longitude,
    latitude: center?.latitude,
    zoom: 13,
    width: "100%",
    height: "100%",
  });
  return (
    <div className=" flex  items-center justify-center">
      <Map
        {...viewport}
        onMove={(evt) => setViewport(evt.viewport)}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/zonghong/cks1a85to4kqf18p6zuj5zdx6"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
      >
        {coordinates?.map((location, idx) => (
          <div key={idx} className="relative">
            <Marker
              longitude={Number(location.longitude)}
              latitude={Number(location.latitude)}
              color="red"
              onClick={() => setSelectedLocation(post)}
            >
              <div className="bg-white h-8  w-20 text-black flex items-center justify-center rounded-full first-letter: wabsolute top-0 -right-4">
                <p>
                  <span>No:{idx + 1}</span>
                  <span className="ml-1">Place</span>
                </p>
              </div>
            </Marker>
          </div>
        ))}
        {/* {mapImgPost?.map((post) => (
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
                {post?.mainImage && (
                  <Image
                    layout="fixed"
                    width={60}
                    height={60}
                    src={urlFor(post?.mainImage)?.url()}
                    alt="img"
                    objectFit="contain"
                    className=""
                  />
                )}
              </div>
            </Marker>
            {selectedLocation === post?.location?.longitude ? (
              <div>
                <Popup
                  closeOnClick={false}
                  onClose={() => setSelectedLocation({})}
                  latitude={post.location.latitude}
                  longitude={post.location.longitude}
                >
                  <div
                    onClick={() => router.push(`/post/${post.slug.current}`)}
                    className="cursor-pointer"
                  >
                    <p className="font-bold hover:underline">{post.title}</p>
                  </div>
                </Popup>
              </div>
            ) : (
              false
            )}
          </div>
        ))} */}
      </Map>
    </div>
  );
}

export default TripDetailsMap;
