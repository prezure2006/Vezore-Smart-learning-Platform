import "./upload.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/videos/upload";
const MAX_SIZE_MB = 500;
const STEPS = ["Uploading", "Processing", "Done"];

const formatSize = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

// fetch() can't report upload progress, XMLHttpRequest can
const sendVideo = (formData, onProgress, onUploaded) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", API);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable)
        onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.upload.onload = onUploaded;
    xhr.onload = () => {
      let data = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        /* response was not JSON */
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else
        reject(new Error(data.message || "Upload failed. Please try again."));
    };
    xhr.onerror = () =>
      reject(new Error("Network error. Is the server running?"));
    xhr.send(formData);
  });

const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [descr, setDescr] = useState("");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [stage, setStage] = useState("idle"); // idle | uploading | processing | done
  const [progress, setProgress] = useState(0);
  const [errormsg, setErrmsg] = useState("");

  const busy = stage === "uploading" || stage === "processing";
  const stepIndex = { uploading: 0, processing: 1, done: 2 }[stage];

  const pickFile = (f) => {
    setErrmsg("");
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setErrmsg("Please choose a video file.");
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrmsg(`File is too large. Maximum size is ${MAX_SIZE_MB} MB.`);
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (!busy) pickFile(e.dataTransfer.files[0]);
  };

  const reset = () => {
    setTitle("");
    setDescr("");
    setFile(null);
    setProgress(0);
    setStage("idle");
    setErrmsg("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setErrmsg("");

    if (!title.trim() || !descr.trim()) {
      setErrmsg("Title and description are required.");
      return;
    }
    if (!file) {
      setErrmsg("Please select a video to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", descr.trim());
    formData.append("video", file);

    try {
      setStage("uploading");
      setProgress(0);
      await sendVideo(formData, setProgress, () => setStage("processing"));
      setStage("done");
    } catch (err) {
      setErrmsg(err.message);
      setStage("idle");
    }
  };

  // Success screen
  if (stage === "done") {
    return (
      <div className="main-container">
        <div className="success-card">
          <span className="success-icon">✅</span>
          <h2>Video uploaded!</h2>
          <p>
            Your video is ready. Open the watch page to see the AI summary and
            transcript.
          </p>
          <div className="success-actions">
            <button className="primary-btn" onClick={() => navigate("/")}>
              Go to videos
            </button>
            <button className="secondary-btn" onClick={reset}>
              Upload another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <h1>Upload a video</h1>
      <p className="upload-sub">Add a video to help yourself and others too.</p>

      <form onSubmit={handleUpload}>
        <div className="inner-container">
          {/* Drag and drop area */}
          <div
            className={`dropzone ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
            onClick={() => !busy && fileInputRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="video"
              name="video"
              accept="video/*"
              ref={fileInputRef}
              hidden
              onChange={(e) => pickFile(e.target.files[0])}
            />
            {file ? (
              <>
                <span className="drop-icon">🎞️</span>
                <p className="drop-title">{file.name}</p>
                <p className="drop-hint">
                  {formatSize(file.size)} · click to change
                </p>
              </>
            ) : (
              <>
                <span className="drop-icon">⬆️</span>
                <p className="drop-title">Drag and drop your video here</p>
                <p className="drop-hint">
                  or click to browse · up to {MAX_SIZE_MB} MB
                </p>
              </>
            )}
          </div>

          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              placeholder="Title of the video"
              id="title"
              name="title"
              value={title}
              disabled={busy}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              placeholder="What is this video about?"
              id="description"
              name="description"
              value={descr}
              disabled={busy}
              onChange={(e) => setDescr(e.target.value)}
            ></textarea>
          </div>

          {/* Progress steps */}
          {busy && (
            <div className="progress-area">
              <div className="steps">
                {STEPS.map((s, i) => (
                  <div
                    key={s}
                    className={`step ${i < stepIndex ? "done" : ""} ${i === stepIndex ? "current" : ""}`}
                  >
                    <span className="step-dot">
                      {i < stepIndex ? "✓" : i + 1}
                    </span>
                    <span className="step-label">{s}</span>
                  </div>
                ))}
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${stage === "processing" ? "indeterminate" : ""}`}
                  style={{
                    width: stage === "uploading" ? `${progress}%` : "100%",
                  }}
                />
              </div>
              <p className="progress-text">
                {stage === "uploading"
                  ? `Uploading... ${progress}%`
                  : "Processing your video. This can take a minute."}
              </p>
            </div>
          )}

          {errormsg && (
            <div className="alert alert-error" role="alert">
              {errormsg}
            </div>
          )}

          <button className="submit-btn" disabled={busy} type="submit">
            {busy ? "Please wait..." : "Upload video"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
