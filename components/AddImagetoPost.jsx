import React, { useState, useEffect, useRef } from "react";
import {
  AiOutlinePlusCircle,
  AiOutlineClose,
  AiOutlineCamera,
} from "react-icons/ai";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
function AddImagetoPost({ selectPost, setPhase }) {
  const title = selectPost?.title;
  const id = selectPost?._id;
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
  console.log("file", file);

  const uploadImage = async () => {
    const formData = new FormData();
    const newid = selectPost?._id.toString();
    console.log("newid", newid);
    formData.append("id", `${newid}`);
    formData.append("title", `${selectPost?.title}`);
    formData.append("file", file);
    formData.append("path");

    const requestOptions = {
      method: "POST",
      body: formData,
    };

    console.log(requestOptions);
    try {
      await fetch("/api/upload", requestOptions).then((_res) => {
        console.log("upload", _res);
        router.push("/admin");
      });
    } catch (err) {
      console.log(err);
    }
  };

  const upload2 = async () => {
    const formData = new FormData();
    const newid = selectPost?._id.toString();
    formData.append("id", `${newid}`);
    const requestOptions = {
      method: "POST",
      body: formData,
    };

    console.log(requestOptions);

    // try {
    //   await fetch("/api/addImagetopost");
    // } catch (err) {
    //   console.error("err", err);
    // }
  };

  function uploadFile(e) {
    setFile(e.target.files[0]);
  }

  const makePost = async () => {
    if (!file) false;
    const notification = toast.loading("Uploading Image...");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("id", id);
    formData.append("image", file);
    const requestOptions = {
      method: "POST",
      body: formData,
    };
    await fetch("/api/addImagetopost", requestOptions)
      .then((result) =>
        toast.success("Image Upload Success !!!", {
          id: notification,
        })
      )
      .finally(() => {
        setPhase("Post");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error creating post", {
          id: notification,
        });
      });
    setFile(null);
  };
  return (
    <div className="flex-1 flex flex-col px-10 py-2 shadow-lg">
      <div className="flex items-center justify-center space-x-5">
        <h1 className="font-bold text-xl my-5">Title:{selectPost?.title}</h1>
        <p className="font-light hidden lg:inline-flex">id:{selectPost?._id}</p>
      </div>
      <div className="flex items-center justify-center w-full">
        {file && (
          <img
            src={file ? URL.createObjectURL(file) : null}
            className="w-[55%] h-[55%] lg:w-[30%] lg:h-[30%] object-contain"
            alt="image to upload"
          />
        )}
      </div>

      <form
        method="post"
        action="/api/addImagetopost"
        encType="multipart/form-data"
        className="flex items-center justify-center my-4 w-full"
      >
        <input name="image" type="file" onChange={uploadFile} />
      </form>
      <button
        onClick={makePost}
        className=" bg-pink-400 w-full px-1 py-2 rounded-lg mt-10 shadow-lg hover:shadow-xl font-bold hover:text-white"
      >
        Upload
      </button>
    </div>
  );
}

export default AddImagetoPost;
