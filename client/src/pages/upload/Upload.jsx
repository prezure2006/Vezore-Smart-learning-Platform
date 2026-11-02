import "./upload.css";
import { useState, useRef } from "react";
const Upload = () => {
  const [title, updateTitle] = useState("");
  const [descr, updateDescr] = useState("");
  const videoRef = useRef(null);
  const handleUpload = (e) => {
    e.preventDefault();
    const selectedFile = videoRef.current.files[0];
    console.log("Upload form Submitted");
    console.log(selectedFile);
  };

  return (
    <div className="main-container">
      <h1>Upload a video</h1>
      <form onSubmit={handleUpload}>
        <div className="inner-container">
          <label htmlFor="title">Title </label>
          <input
            type="text"
            placeholder="Title of the Video"
            id="title"
            name="title"
            value={title}
            onChange={(e) => updateTitle(e.target.value)}
          />
          <label htmlFor="description">Description</label>
          <textarea
            placeholder="Description of the Video"
            id="description"
            name="description"
            value={descr}
            onChange={(e) => updateDescr(e.target.value)}
          ></textarea>
          <input
            type="file"
            id="video"
            name="video"
            accept="video/*"
            ref={videoRef}
          />
          <button type="submit">Upload</button>
        </div>
      </form>
    </div>
  );
};
export default Upload;
