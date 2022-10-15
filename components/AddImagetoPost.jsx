import React, { useState } from "react";
import toast from "react-hot-toast";

function AddImagetoPost({
  selectPost,
  setPhase,
  handleRefresh,
  setSelectPost,
}) {
  const title = selectPost?.title;
  const id = selectPost?._id;
  const [file, setFile] = useState(null);

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
      .catch((error) => {
        console.error(error);
        toast.error("Error creating post", {
          id: notification,
        });
      });
    handleRefresh();
    setFile(null);
    setSelectPost();
    setPhase("Post");
  };
  return (
    <div className="flex-1 flex flex-col px-10 py-2 ">
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
      <div className="w-full px-10">
        <button
          disabled={!file || !selectPost}
          onClick={makePost}
          className=" bg-pink-400 disabled:bg-opacity-50 w-full px-1 py-2 rounded-lg mt-10 shadow-lg hover:shadow-xl font-bold hover:text-white"
        >
          {!selectPost ? "please pick a post" : "  Upload"}
        </button>
      </div>
    </div>
  );
}

export default AddImagetoPost;
