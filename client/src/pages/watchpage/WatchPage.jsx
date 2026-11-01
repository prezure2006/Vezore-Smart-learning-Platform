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
    <video controls width="800">
      <source src={video.videoUrl} type="video/mp4" />
    </video>
  );
};
export default WatchPage;
