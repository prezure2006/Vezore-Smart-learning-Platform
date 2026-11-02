import "./upload.css";
import { useState, useRef } from "react";
const Upload = () => {
  const [title, updateTitle] = useState("");
  const [descr, updateDescr] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadstate, setuploadState] = useState("Upload");
  const [success, setSuccess] = useState("");
  const [errormsg, setErrmsg] = useState("");
  const videoRef = useRef(null);
  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      setSuccess("");
      setErrmsg("");
      const selectedFile = videoRef.current.files[0];
      if (!title.trim() || !descr.trim()) {
        throw new Error("Title and description are required");
      }

      if (!selectedFile) {
        throw new Error("Please select data");
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", descr);
      formData.append("video", selectedFile);
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/videos/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      setSuccess("Video uploaded successfully!");
    } catch (error) {
      setErrmsg(error.message);
      console.log("error", error);
    } finally {
      setLoading(false);
    }
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
          <button disabled={loading} type="submit">
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
      {success && <p>{success}</p>}
      {errormsg && <p>{errormsg}</p>}
    </div>
  );
};
export default Upload;
