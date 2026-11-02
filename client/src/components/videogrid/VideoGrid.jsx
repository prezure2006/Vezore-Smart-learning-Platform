import "./videogrid.css";

import VideoCard from "../videocard/VideoCard";
import { useEffect, useState } from "react";
const VideoGrid = () => {
  const [video, setvideo] = useState([]);
  useEffect(() => {
    try {
      const fetchVideos = async () => {
        console.log("VideoGrid mounted");
        // 1. Fetch the API response
        const response = await fetch("http://localhost:5000/api/videos/all");
        // 2. Convert response to JSON
        const data = await response.json();
        // 3. Update video state
        setvideo(data.videos);
      };
      fetchVideos();
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  }, []);
  const handleDelete = async (id) => {
    try {
      // how we send  requestto backend
      const response = await fetch(
        `http://localhost:5000/api/videos/delete/${id}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to delete video");
      }
      setvideo((prevVideos) => prevVideos.filter((vide) => vide._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="video-grid">
      {video.map((vide) => {
        return (
          <VideoCard
            key={vide.duration}
            title={vide.title}
            thumbnail={vide.thumbnailURL}
            uploadDate={vide.uploadDate}
            duration={vide.duration}
            id={vide._id}
            description={vide.description}
            onDelete={handleDelete}
          />
        );
      })}
    </div>
  );
};
export default VideoGrid;
