import "./watchpage.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";

const API = "http://localhost:5000/api/videos";

const formatTime = (s = 0) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

const TABS = [
  { key: "summary", label: "✨ Summary" },
  { key: "transcript", label: "📝 Transcript" },
  { key: "ask", label: "💬 Ask AI" },
];

const WatchPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const videoRef = useRef(null);
  const listRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [videoError, setVideoError] = useState("");
  const [descOpen, setDescOpen] = useState(false);

  const [tab, setTab] = useState("transcript");
  const [currentTime, setCurrentTime] = useState(0);

  const [transcript, setTranscript] = useState(null);
  const [segments, setSegments] = useState([]);
  const [transcriptionStatus, setTranscriptionStatus] = useState("pending");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState("");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // ---------- Data ----------
  const fetchVideo = useCallback(async () => {
    try {
      setVideoError("");
      const response = await fetch(`${API}/${id}`);
      if (!response.ok) throw new Error("Failed to fetch video");
      const data = await response.json();
      setVideo(data.video);
    } catch (error) {
      console.error("Failed to fetch video:", error);
      setVideoError("Could not load this video.");
    }
  }, [id]);

  const loadTranscript = useCallback(async () => {
    try {
      const response = await fetch(`${API}/${id}/transcript`);

      if (response.status === 202) {
        const data = await response.json();
        setTranscriptionStatus(data.transcriptionStatus || "processing");
        return "processing";
      }
      if (response.status === 404) {
        setTranscriptionStatus("pending");
        return "pending";
      }
      if (!response.ok) throw new Error("Failed to fetch transcript");

      const data = await response.json();
      setTranscript(data.transcript);
      setSegments(data.segments || []);
      setTranscriptionStatus(data.transcriptionStatus);
      return data.transcriptionStatus;
    } catch (error) {
      console.error("Transcript fetch error:", error);
      return "error";
    }
  }, [id]);

  useEffect(() => {
    fetchVideo();
    loadTranscript();
  }, [fetchVideo, loadTranscript]);

  // Poll while the backend is still processing
  useEffect(() => {
    if (transcriptionStatus !== "processing" || isTranscribing) return;
    const timer = setInterval(loadTranscript, 4000);
    return () => clearInterval(timer);
  }, [transcriptionStatus, isTranscribing, loadTranscript]);

  async function handleTranscribe() {
    try {
      setIsTranscribing(true);
      setTranscriptionError("");

      const response = await fetch(`${API}/${id}/transcribe`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to generate transcript");

      const status = await loadTranscript();
      if (status === "failed")
        throw new Error("Transcription failed. Please retry.");
    } catch (error) {
      setTranscriptionError(error.message);
    } finally {
      setIsTranscribing(false);
    }
  }

  // ---------- Player sync ----------
  const activeIndex = segments.findIndex(
    (s) => currentTime >= s.start && currentTime < s.end,
  );

  // Keep the active line centered inside the list (scrolls the list only, not the page)
  useEffect(() => {
    if (activeIndex < 0 || query || tab !== "transcript") return;
    const list = listRef.current;
    const el = list?.querySelector(`[data-index="${activeIndex}"]`);
    if (!list || !el) return;
    list.scrollTo({
      top: el.offsetTop - list.clientHeight / 2 + el.clientHeight / 2,
      behavior: "smooth",
    });
  }, [activeIndex, query, tab]);

  const seekTo = (seconds) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seconds;
    videoRef.current.play();
  };

  // ---------- Transcript actions ----------
  const fullText = transcript || segments.map((s) => s.text).join(" ");

  const copyTranscript = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const downloadTranscript = () => {
    const lines = segments.length
      ? segments
          .map((s) => `[${formatTime(s.start)}] ${s.text.trim()}`)
          .join("\n")
      : fullText;
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${video?.title || "transcript"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const visibleSegments = query.trim()
    ? segments
        .map((s, i) => ({ ...s, index: i }))
        .filter((s) => s.text.toLowerCase().includes(query.toLowerCase()))
    : segments.map((s, i) => ({ ...s, index: i }));

  // ---------- Early returns (all hooks are above) ----------
  if (videoError) {
    return (
      <div className="watch-message">
        <span className="watch-message-icon">⚠️</span>
        <h3>{videoError}</h3>
        <button className="watch-btn watch-btn-primary" onClick={fetchVideo}>
          Try again
        </button>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="watch-page">
        <div className="watch-main">
          <div className="watch-skeleton watch-skeleton-player" />
          <div className="watch-skeleton watch-skeleton-line" />
          <div className="watch-skeleton watch-skeleton-line short" />
        </div>
      </div>
    );
  }

  // ---------- Transcript tab content ----------
  const renderTranscript = () => {
    if (transcriptionStatus === "completed") {
      return (
        <>
          <div className="watch-tools">
            <input
              type="text"
              className="watch-search"
              placeholder="Search in transcript..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="watch-icon-btn"
              onClick={copyTranscript}
              title="Copy"
            >
              {copied ? "✓" : "Copy"}
            </button>
            <button
              className="watch-icon-btn"
              onClick={downloadTranscript}
              title="Download"
            >
              Download
            </button>
          </div>

          {segments.length > 0 ? (
            <div className="watch-segments" ref={listRef}>
              {visibleSegments.length === 0 && (
                <p className="watch-empty-text">No matches for "{query}"</p>
              )}
              {visibleSegments.map((s) => (
                <button
                  key={s.index}
                  data-index={s.index}
                  className={`watch-segment ${s.index === activeIndex ? "active" : ""}`}
                  onClick={() => seekTo(s.start)}
                >
                  <span className="watch-time">{formatTime(s.start)}</span>
                  <span className="watch-segment-text">{s.text.trim()}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="watch-segments">
              <p className="watch-plain-text">{transcript}</p>
            </div>
          )}
        </>
      );
    }

    if (transcriptionStatus === "processing" || isTranscribing) {
      return (
        <div className="watch-panel-state">
          <div className="watch-spinner" />
          <h4>Generating transcript...</h4>
          <p>This can take a minute. You can keep watching.</p>
        </div>
      );
    }

    return (
      <div className="watch-panel-state">
        <span className="watch-state-icon">
          {transcriptionStatus === "failed" ? "⚠️" : "📝"}
        </span>
        <h4>
          {transcriptionStatus === "failed"
            ? "Transcription failed"
            : "No transcript yet"}
        </h4>
        <p>Generate a searchable transcript with clickable timestamps.</p>
        <button className="watch-btn watch-btn-ai" onClick={handleTranscribe}>
          {transcriptionStatus === "failed"
            ? "Retry transcription"
            : " Generate transcript"}
        </button>
        {transcriptionError && (
          <p className="transcription-error" role="alert">
            {transcriptionError}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="watch-page">
      {/* Left: player and info */}
      <div className="watch-main">
        <div className="player-container">
          <video
            ref={videoRef}
            src={video.videoUrl}
            controls
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          />
        </div>

        <div className="watch-info">
          <div className="watch-title-row">
            <h1 className="watch-title">{video.title}</h1>
            <button
              className="watch-btn watch-btn-secondary btn-edit"
              onClick={() => navigate(`/edit/${id}`)}
            >
              Edit
            </button>
          </div>

          <p className="watch-meta">
            Uploaded {new Date(video.createdAt).toLocaleDateString()}
          </p>

          <div className="watch-desc-box">
            <p className={`video-description ${descOpen ? "open" : ""}`}>
              {video.description}
            </p>
            {video.description?.length > 140 && (
              <button
                className="watch-link-btn"
                onClick={() => setDescOpen((o) => !o)}
              >
                {descOpen ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right: AI panel with tabs */}
      <aside className="watch-panel">
        <div className="watch-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              className={`watch-tab ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="watch-tab-body">
          {tab === "transcript" && renderTranscript()}

          {tab === "summary" && (
            <div className="watch-panel-state">
              <span className="watch-state-icon">✨</span>
              <h4>AI summary</h4>
              <p>Key points and chapters will appear here. Coming soon.</p>
            </div>
          )}

          {tab === "ask" && (
            <div className="watch-panel-state">
              <span className="watch-state-icon">💬</span>
              <h4>Ask AI about this video</h4>
              <p>
                Ask questions and get answers from the transcript. Coming soon.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default WatchPage;
