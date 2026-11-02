import "./videocard.css";
import { useNavigate } from "react-router-dom";
const VideoCard = ({
  title,
  thumbnail,
  duration,
  uploadDate,
  id,
  description,
}) => {
  const navigate = useNavigate();
  return (
    <div className="video-container">
      <img src={thumbnail} alt={title} />
      <p>{title}</p>
      <p>{uploadDate}</p>
      <p>{duration}</p>
      <p>{description}</p>
      <button type="button" onClick={() => navigate(`/watch/${id}`)}>
        Play Now
      </button>
    </div>
  );
};
export default VideoCard;
