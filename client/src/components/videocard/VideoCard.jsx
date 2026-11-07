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
  hasSummary, // optional: true when the AI summary is ready
}) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm("Delete this video?")) {
      onDelete(id);
    }
  };

  return (
    <div className="video-container">
      <div className="thumb-wrap" onClick={() => navigate(`/watch/${id}`)}>
        <img src={thumbnail} alt={title} className="thumb-img" />
        <span className="duration-badge">{duration}</span>
      </div>

      <div className="video-info">
        <h3 className="video-title">{title}</h3>
        <p className="video-meta">{uploadDate}</p>
        <p className="video-desc">{description}</p>
        {hasSummary && <span className="ai-chip">✨ Summary ready</span>}
      </div>

      <div className="button-container">
        <button
          type="button"
          className="play-video"
          onClick={() => navigate(`/watch/${id}`)}
        >
          Play Now
        </button>
        <button type="button" className="delete-video" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
