import React, { useState, useEffect } from "react";
import AddCategoryModal from "../components/AddCategoryModal";
import Head from "next/head";

import {
  openCategoryModal,
  closeCategoryModal,
  openLocationModal,
  closeLocationModal,
  selectCategoryModalIsOpen,
  selectLocationModalIsOpen,
} from "../features/modalSlice";
import { sanityClient, urlFor } from "../sanity";
import AddLocationModal from "../components/AddLocationModal";
import { AiOutlinePlusCircle, AiOutlineClose } from "react-icons/ai";
import AddPost from "../components/AddPost";
import { useDispatch, useSelector } from "react-redux";
import AdminPostList from "../components/AdminPostList";
import AddPostCategories from "../components/AddPostCategories";
import { fetchPost } from "../utils/fetchpost";
import AddImagetoPost from "../components/AddImagetoPost";
import { BiRefresh } from "react-icons/bi";
import toast from "react-hot-toast";

function Admin({ location, categories, posts }) {
  const dispatch = useDispatch();
  const [phase, setPhase] = useState("Post");
  const [selectPost, setSelectPost] = useState(null);
  const [refetchpost, setRefetchPost] = useState(posts);
  const locationModalisOpen = useSelector(selectLocationModalIsOpen);
  const categoryModalisOpen = useSelector(selectCategoryModalIsOpen);

  const Phase = ({ name, isActive, setPhase }) => {
    return (
      <div
        onClick={() => setPhase(name)}
        className={`flex flex-col items-center cursor-pointer`}
      >
        <h1
          className={`font-bold ${
            isActive ? "text-gray-800" : "text-gray-400"
          }`}
        >
          {name}
        </h1>
        <div
          className={`w-4 h-4 rounded-full ${
            isActive ? "bg-blue-600" : "bg-gray-400"
          }`}
        />
      </div>
    );
  };

  const handleRefresh = async () => {
    const refresnToast = toast.loading("Refreshing Post...");
    const query = `*[_type == "post"]{
      ...,
       categories[]->{
         ...,
       },
       mainImage,
       location->{
         ...,
       },
     }| order(_createdAt desc) `;
    const posts = await sanityClient.fetch(query);
    setRefetchPost(posts);
    toast.success("Feeds Updated", { id: refresnToast });
  };

  // useEffect(() => {
  //   if (isposting) {
  //     handleRefresh();
  //   }
  // }, [isposting]);
  return (
    <div className="flex flex-col h-screen max-h-screen">
      <Head>
        <title>Zong Hong PhotoTravel Map Admin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid gap-3 grid-flow-row-dense grid-cols-3 lg:grid-cols-5 mt-1 mb-5">
        <Phase
          setPhase={setPhase}
          name="Post"
          isActive={phase == "Post" ? true : false}
        />
        <Phase
          setPhase={setPhase}
          name="Add Post"
          isActive={phase == "Add Post" ? true : false}
        />
        <Phase
          setPhase={setPhase}
          name="Add Image"
          isActive={phase == "Add Image" ? true : false}
        />
        <Phase
          setPhase={setPhase}
          name="Add Category"
          isActive={phase == "Add Category" ? true : false}
        />
        <div className="flex flex-col items-center justify-center cursor-pointer">
          <h1 className={`font-bold hover:text-blue-300`}>Refresh</h1>
          <BiRefresh
            onClick={handleRefresh}
            className=" text-blue-500 h-6 w-6 cursor-pointer text-twitterBlue transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
          />
        </div>
      </div>
      <main className="h-screen">
        {phase == "Post" && (
          <AdminPostList
            posts={refetchpost}
            setSelectPost={setSelectPost}
            selectPost={selectPost}
          />
        )}
        {phase == "Add Post" && (
          <AddPost
            posts={refetchpost}
            location={location}
            categories={categories}
            handleRefresh={handleRefresh}
            setPhase={setPhase}
          />
        )}
        {phase == "Add Image" && (
          <AddImagetoPost
            selectPost={selectPost}
            setPhase={setPhase}
            handleRefresh={handleRefresh}
            setSelectPost={setSelectPost}
          />
        )}
        {phase == "Add Category" && (
          <AddPostCategories
            setPhase={setPhase}
            selectPost={selectPost}
            categories={categories}
            handleRefresh={handleRefresh}
            setSelectPost={setSelectPost}
          />
        )}
      </main>

      {locationModalisOpen && <AddLocationModal />}
      {categoryModalisOpen && <AddCategoryModal />}
    </div>
  );
}
export default Admin;
export const getServerSideProps = async (context) => {
  const query = `*[_type == "post"]{
   ...,
    categories[]->{
      ...,
    },
    mainImage,
    location->{
      ...,
    },
  }| order(_createdAt desc) `;

  const locationquery = `*[_type == "location"]{
     ...
    }`;
  const categoriesquery = `*[_type == "category"]{
        ...
       }`;
  const posts = await sanityClient.fetch(query);
  const location = await sanityClient.fetch(locationquery);
  const categories = await sanityClient.fetch(categoriesquery);

  return {
    props: {
      posts,
      location,
      categories,
    },
  };
};
