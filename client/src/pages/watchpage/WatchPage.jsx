import "./watchpage.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const WatchPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const videoRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState("");
  const [transcript, setTranscript] = useState(null);
  const [segments, setSegments] = useState([]);
  const [transcriptionStatus, setTranscriptionStatus] = useState("pending");
  const [showTranscript, setShowTranscript] = useState(false);

  // Fetch video details
  useEffect(() => {
    async function fetchVideo() {
      try {
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

  // Fetch existing transcript when page loads
  useEffect(() => {
    async function fetchTranscript() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/videos/${id}/transcript`,
        );

        // Transcript is still being processed
        if (response.status === 202) {
          const data = await response.json();
          setTranscriptionStatus(data.transcriptionStatus);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch transcript");
        }

        const videoData = await response.json();

        setTranscript(videoData.transcript);
        setSegments(videoData.segments || []);
        setTranscriptionStatus(videoData.transcriptionStatus);
      } catch (error) {
        console.error("Transcript fetch error:", error);
      }
    }

    fetchTranscript();
  }, [id]);

  // Generate transcript
  async function handleTranscribe() {
    try {
      setIsTranscribing(true);
      setTranscriptionError("");

      const videoTranscribe = await fetch(
        `http://localhost:5000/api/videos/${id}/transcribe`,
        {
          method: "POST",
        },
      );

      if (!videoTranscribe.ok) {
        throw new Error("Failed to generate transcript");
      }

      // Fetch the saved transcript from MongoDB
      const response = await fetch(
        `http://localhost:5000/api/videos/${id}/transcript`,
      );

      if (response.status === 202) {
        const data = await response.json();
        setTranscriptionStatus(data.transcriptionStatus);
        throw new Error("Transcript is still processing");
      }

      if (!response.ok) {
        throw new Error("Failed to retrieve generated transcript");
      }

      const videoData = await response.json();

      if (videoData.transcriptionStatus !== "completed") {
        throw new Error("Transcript generation was not completed");
      }

      setTranscript(videoData.transcript);
      setSegments(videoData.segments || []);
      setTranscriptionStatus(videoData.transcriptionStatus);

      // Automatically show transcript after generation
      setShowTranscript(true);
    } catch (error) {
      setTranscriptionError(error.message);
    } finally {
      setIsTranscribing(false);
    }
  }
  function handleTranscriptClick() {
    if (transcriptionStatus === "completed") {
      setShowTranscript((previous) => !previous);
    } else {
      handleTranscribe();
    }
  }

  function seekToo(seconds) {
    try {
      const videoReference = videoRef.current;

      if (videoReference) {
        videoReference.currentTime = seconds;
        videoReference.play();
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  function formatTiming(second) {
    const minutes = Math.floor(second / 60);
    const seconds = Math.floor(second % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  // Keep hooks above this conditional return
  if (!video) {
    return <p>Loading video...</p>;
  }

  return (
    <div className="watch-page">
      <div className="player-container">
        <video controls ref={videoRef}>
          <source
            src={video.videoUrl}
            type="video/mp4"
            className="video-main"
          />
        </video>
      </div>

      <div className="video-info">
        <h1>
          Title: <strong>{video.title}</strong>
        </h1>

        <p>Upload Date: {new Date(video.createdAt).toLocaleDateString()}</p>

        <p className="video-description">Description: {video.description}</p>
      </div>

      <div className="edit-button">
        <button className="btn-edit" onClick={() => navigate(`/edit/${id}`)}>
          Edit Video
        </button>
      </div>
      <div className="transcript">
        <button
          className="trasn-butn"
          onClick={handleTranscriptClick}
          disabled={isTranscribing || transcriptionStatus === "processing"}
        >
          {isTranscribing
            ? "Generating..."
            : transcriptionStatus === "processing"
              ? "Processing..."
              : transcriptionStatus === "completed"
                ? showTranscript
                  ? "Hide Transcript"
                  : "Show Transcript"
                : transcriptionStatus === "failed"
                  ? "Retry Transcription"
                  : "Generate Transcript"}
        </button>

        {transcriptionError && (
          <p className="transcription-error">{transcriptionError}</p>
        )}

        {showTranscript && transcript && (
          <div className="transcript-content">
            <h2>Video Transcript</h2>
            <div>
              <ul>
                {segments.map((seg, index) => (
                  <li key={index}>
                    <button
                      onClick={() => seekToo(seg.start)}
                      className="timeline-info"
                    >
                      <span className="time-real">
                        {formatTiming(seg.start)}
                      </span>{" "}
                      - {seg.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default WatchPage;
