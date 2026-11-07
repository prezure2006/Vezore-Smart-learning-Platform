import "./videogrid.css";
import VideoCard from "../videocard/VideoCard";
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api/videos";

const VideoGrid = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API}/all`);
      if (!response.ok) throw new Error("Failed to load videos");
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Could not load videos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete video");
      setVideos((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      console.error(err);
      alert("Could not delete the video.");
    }
  };

  // Loading: show skeleton cards instead of a blank page
  if (loading) {
    return (
      <div className="video-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="skeleton-card" key={i}>
            <div className="skeleton skeleton-thumb" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
          </div>
        ))}
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="grid-message">
        <span className="grid-message-icon">⚠️</span>
        <h3>{error}</h3>
        <button className="retry-btn" onClick={fetchVideos}>
          Try again
        </button>
      </div>
    );
  }

  // Empty
  if (videos.length === 0) {
    return (
      <div className="grid-message">
        <span className="grid-message-icon">🎬</span>
        <h3>No videos yet</h3>
        <p>Upload your first video to get an AI summary and transcript.</p>
      </div>
    );
  }

  return (
    <div className="video-grid">
      {videos.map((v) => (
        <VideoCard
          key={v._id}
          id={v._id}
          title={v.title}
          thumbnail={v.thumbnailURL}
          uploadDate={new Date(v.uploadDate).toLocaleDateString()}
          duration={v.duration}
          description={v.description}
          hasSummary={Boolean(v.summary)} // adjust to your field name
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
