import "./videocard.css";
import { useNavigate } from "react-router-dom";
const VideoCard = ({
  title,
  thumbnail,
  duration,
  uploadDate,
  id,
  description,
  onDelete,
}) => {
  const navigate = useNavigate();
  return (
    <div className="video-container">
      <img src={thumbnail} alt={title} />
      <p>{title}</p>
      <p>{uploadDate}</p>
      <p>{duration}</p>
      <p>{description}</p>
      <div className="button-container">
        <button type="button" onClick={() => navigate(`/watch/${id}`)}>
          Play Now
        </button>

        <button className="delete-video" onClick={() => onDelete(id)}>
          Delete
        </button>
      </div>
    </div>
  );
};
export default VideoCard;
