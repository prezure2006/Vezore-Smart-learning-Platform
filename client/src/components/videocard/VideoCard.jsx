import "./videocard.css";
const VideoCard = ({ title, thumbnail, duration, uploadDate }) => {
  return (
    <div className="video-container">
      <img src={thumbnail} alt={title} />
      <p>{title}</p>
      <p>{uploadDate}</p>
      <p>{duration}</p>
      <button type="button">Play Now</button>
    </div>
  );
};
export default VideoCard;
