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
    <div>
      <div>
        <h1>Title:{selectPost?.title}</h1>
        <p>id:{selectPost?._id}</p>
        <img
          src={file ? URL.createObjectURL(file) : null}
          className="w-24 h-24"
        />
        <form
          method="post"
          action="/api/addImagetopost"
          encType="multipart/form-data"
        >
          <input name="image" type="file" onChange={uploadFile} />
        </form>
        <hr className="my-12" />
        <button onClick={makePost}>upload2</button>
      </div>
    </div>
  );
}

export default AddImagetoPost;
