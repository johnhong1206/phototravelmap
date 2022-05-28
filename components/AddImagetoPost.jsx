import React, { useState, useEffect, useRef } from "react";
import {
  AiOutlinePlusCircle,
  AiOutlineClose,
  AiOutlineCamera,
} from "react-icons/ai";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
function AddImagetoPost({ selectPost, setPhase }) {
  const [file, setFile] = useState(null);
  const router = useRouter();

  const imgPickerRef = useRef(null);
  const [imgToPost, setImgtoPost] = useState(null);
  const imagefileName = selectPost?.title.concat(
    new Date().getTime(),
    "-",
    selectPost._id
  );
  console.log(imagefileName);

  const addImgtoPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setImgtoPost(readerEvent.target.result);
    };
  };

  const removeImg = () => {
    setImgtoPost(null);
  };

  const uploadImage = async () => {
    const formData = new FormData();
    const newid = selectPost?._id.toString();
    console.log("newid", newid);
    formData.append("id", `${newid}`);
    formData.append("title", `${selectPost?.title}`);
    formData.append("file", file);
    const requestOptions = {
      method: "POST",
      body: formData,
    };

    try {
      await fetch("/api/upload").then((_res) => {
        console.log("upload", _res);
        router.push("/admin");
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div>
        <h1>Title:{selectPost?.title}</h1>
        <p>id:{selectPost?._id}</p>
        <form method="post" action="/api/upload" enctype="multipart/form-data">
          <input name="image" type="file" />
          <input name="id" type="text" value={selectPost?._id} hidden />
          <button
            className={`bg-red-400 border-none cursor-pointer w-1/4 text-white rounded-lg hover:bg-opacity-70 font-medium p-1`}
            onClick={uploadImage}
          >
            Create
          </button>
        </form>
      </div>
      <hr className="my-10" />
      <div className={`flex flex-col mb-3`}>
        <label className={`mb-1 font-medium`}>Choose an image</label>
      </div>
      <div className="flex flex-row items-center space-x-2">
        <h2 className="text-xl font-medium">Title:</h2>
        <p className="font-light">{selectPost?.title}</p>
        <p className="font-light">{selectPost?._id}</p>
      </div>
      {imgToPost && (
        <div
          onClick={removeImg}
          className="flex flex-col filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer"
        >
          <img className="h-10 object-contain" src={imgToPost} alt="" />
          <p className="text-xs text-red-500 text-center">Remove</p>
        </div>
      )}
      <div className="inputIcon" onClick={() => imgPickerRef.current.click()}>
        <AiOutlineCamera className="h-7 text-green-500" />
        <p className="text-xs sm:text-sm lg:text-base">Photo/Video</p>
        <input ref={imgPickerRef} type="file" hidden onChange={addImgtoPost} />
      </div>{" "}
      <button
        className={`bg-red-400 border-none cursor-pointer w-1/4 text-white rounded-lg hover:bg-opacity-70 font-medium p-1`}
        // onClick={uploadImage}
      >
        Create
      </button>
      <hr />
    </div>
  );
}

export default AddImagetoPost;
