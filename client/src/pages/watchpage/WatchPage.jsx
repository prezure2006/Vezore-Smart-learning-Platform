import "./watchpage.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
const WatchPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  useEffect(() => {
    async function fetchVideo() {
      try {
        // Fetch video here
        const response = await fetch(`http://localhost:5000/api/videos/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch video");
        }
        const data = await response.json();
        setVideo(data.video);
      } catch (error) {
        console.error("Failed to fetch video:", error);
      }
    }

    fetchVideo();
  }, [id]);
  if (!video) {
    return <p>Loading video...</p>;
  }
  return (
    <div className="watch-page">
      <div className="player-container">
        <video controls width="800">
          <source src={video.videoUrl} type="video/mp4" />
        </video>
      </div>
      <div className="video-info">
        <h1>
          Title: <strong>{video.title}</strong>
        </h1>
        <p>Upload Date : {new Date(video.createdAt).toLocaleDateString()}</p>
        <p className="video-description">Description:{video.description}</p>
      </div>
      <div className="edit-button">
        <button className="btn-edit">Edit Video</button>
      </div>
    </div>
  );
};
export default WatchPage;
