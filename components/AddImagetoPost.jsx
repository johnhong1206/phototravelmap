import React, { useState, useEffect, useRef } from "react";
import {
  AiOutlinePlusCircle,
  AiOutlineClose,
  AiOutlineCamera,
} from "react-icons/ai";
import toast from "react-hot-toast";

function AddImagetoPost({ selectPost, setPhase }) {
  const [file, setFile] = useState(null);

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
    formData.append("_id", "dtdO4o3cRLPwh3vnwtdHGE");
    // formData.append("file", file);
    const requestOptions = {
      method: "POST",
      body: formData,
    };
    try {
      await fetch("/api/addImagetopost", requestOptions).then((_res) => {
        console.log(_res);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const upload3 = async () => {
    const data = new FormData();
    data.append("file", file);
    const imageInfo = {
      _id: "dtdO4o3cRLPwh3vnwtdHGE",
    };

    await fetch("/api/uploadimage", {
      body: JSON.stringify(imageInfo),
      method: "POST",
    });
  };
  function uploadFile(e) {
    setFile(e.target.files[0]);
  }
  return (
    <div>
      <div className={`flex flex-col mb-3`}>
        <label className={`mb-1 font-medium`}>Choose an image</label>
        <input type="file" accept="image/*" onChange={uploadFile} />
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
        onClick={uploadImage}
      >
        Create
      </button>
      <hr />
      <button
        onClick={upload3}
        className="mt-10 bg-red-400 border-none cursor-pointer w-1/4 text-white rounded-lg hover:bg-opacity-70 font-medium p-1"
      >
        upload3
      </button>
    </div>
  );
}

export default AddImagetoPost;
