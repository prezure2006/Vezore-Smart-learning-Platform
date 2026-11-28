import "./watchpage.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";

const API_URL = "http://localhost:5000"; // move to an env variable before deploying
const POLL_INTERVAL_MS = 4000;

const CHAT_SUGGESTIONS = [
  "Summarize the key points",
  "Explain the hardest idea simply",
  "Quiz me on this lecture",
];

// Sends the login token with every request. Change "token" to the key you
// save at login, or switch to `credentials: "include"` if you use cookies.
function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

// Pulls a readable message out of a failed response
async function errorMessage(response, fallback) {
  if (response.status === 401) return "Your session has expired. Log in again.";
  const body = await response.json().catch(() => ({}));
  return body.message || body.error || fallback;
}

function formatTiming(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const WatchPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const videoRef = useRef(null);
  const listRef = useRef(null);
  const chatLogRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [videoError, setVideoError] = useState("");
  const [currentTime, setCurrentTime] = useState(0);

  // Side panel: "transcript" | "summary" | "chat"
  const [showPanel, setShowPanel] = useState(true);
  const [activeTab, setActiveTab] = useState("transcript");

  // Transcript
  const [segments, setSegments] = useState([]);
  const [transcriptionStatus, setTranscriptionStatus] = useState("pending");
  const [transcriptionError, setTranscriptionError] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Summary
  const [summary, setSummary] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Chat
  const [messages, setMessages] = useState([]); // { role: "user" | "assistant", content }
  const [chatInput, setChatInput] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [chatError, setChatError] = useState("");

  // ---------- Loaders ----------

  // Fetch the saved transcript and sync state. Returns the status.
  const loadTranscript = useCallback(
    async (signal) => {
      const response = await authFetch(
        `${API_URL}/api/videos/${id}/transcript`,
        { signal },
      );
      const data = await response.json().catch(() => ({}));

      if (response.status === 202) {
        setTranscriptionStatus(data.transcriptionStatus);
        return data.transcriptionStatus;
      }
      if (!response.ok) throw new Error("Failed to fetch transcript");

      setSegments(data.segments || []);
      setTranscriptionStatus(data.transcriptionStatus);
      return data.transcriptionStatus;
    },
    [id],
  );

  // Fetch the saved summary. Response: { summary } (null if none yet)
  const loadSummary = useCallback(
    async (signal) => {
      const response = await authFetch(`${API_URL}/api/videos/${id}/summary`, {
        signal,
      });
      if (!response.ok) throw new Error("Failed to fetch summary");

      const data = await response.json();
      setSummary(data.summary || "");
    },
    [id],
  );

  // ---------- Effects ----------

  // Video details
  useEffect(() => {
    const controller = new AbortController();
    setVideo(null);
    setVideoError("");
    setCurrentTime(0);

    async function fetchVideo() {
      try {
        const response = await authFetch(`${API_URL}/api/videos/${id}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Failed to fetch video");

        const data = await response.json();
        setVideo(data.video);
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Failed to fetch video:", error);
        setVideoError(
          "We couldn't load this video. Check your connection and try again.",
        );
      }
    }

    fetchVideo();
    return () => controller.abort();
  }, [id]);

  // Existing transcript and summary when the page loads
  useEffect(() => {
    const controller = new AbortController();
    setSegments([]);
    setTranscriptionStatus("pending");
    setTranscriptionError("");
    setSummary("");
    setSummaryError("");
    setMessages([]);
    setChatInput("");
    setChatError("");
    setIsReplying(false);
    setActiveTab("transcript");
    setShowPanel(true);

    const ignoreAbort = (label) => (error) => {
      if (error.name !== "AbortError") console.error(label, error);
    };

    loadTranscript(controller.signal).catch(
      ignoreAbort("Transcript fetch error:"),
    );
    loadSummary(controller.signal).catch(ignoreAbort("Summary fetch error:"));

    return () => controller.abort();
  }, [id, loadTranscript, loadSummary]);

  // Keep checking while the server is still transcribing
  useEffect(() => {
    if (transcriptionStatus !== "processing") return;
    const timer = setInterval(() => {
      loadTranscript().catch((e) =>
        console.error("Transcript polling error:", e),
      );
    }, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [transcriptionStatus, loadTranscript]);

  // ---------- Actions ----------

  async function handleTranscribe() {
    try {
      setIsTranscribing(true);
      setTranscriptionError("");

      const response = await authFetch(
        `${API_URL}/api/videos/${id}/transcribe`,
        { method: "POST" },
      );
      if (!response.ok) {
        throw new Error(
          await errorMessage(response, "Failed to generate transcript"),
        );
      }

      const status = await loadTranscript();
      if (status !== "completed" && status !== "processing") {
        throw new Error("The transcript could not be completed. Try again.");
      }
    } catch (error) {
      setTranscriptionError(error.message);
    } finally {
      setIsTranscribing(false);
    }
  }

  // POST /api/videos/:id/summary generates, saves and returns the summary
  async function handleSummarize() {
    try {
      setIsSummarizing(true);
      setSummaryError("");

      const response = await authFetch(`${API_URL}/api/videos/${id}/summary`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(
          await errorMessage(response, "Failed to generate summary"),
        );
      }

      const data = await response.json();
      setSummary(data.summary || "");
    } catch (error) {
      setSummaryError(error.message);
    } finally {
      setIsSummarizing(false);
    }
  }

  // POST /api/videos/:id/chat  body: { message, history }  ->  { reply }
  async function sendMessage(text) {
    const message = text.trim();
    if (!message || isReplying) return;

    const history = messages;
    setMessages([...history, { role: "user", content: message }]);
    setChatInput("");
    setChatError("");
    setIsReplying(true);

    try {
      const response = await authFetch(`${API_URL}/api/videos/${id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      if (!response.ok) {
        throw new Error(
          await errorMessage(response, "The AI couldn't reply. Try again."),
        );
      }

      const data = await response.json();
      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      // Put the question back in the box so one click on Send retries it
      setMessages(history);
      setChatInput(message);
      setChatError(error.message);
    } finally {
      setIsReplying(false);
    }
  }

  function seekTo(seconds) {
    const player = videoRef.current;
    if (!player) return;
    player.currentTime = seconds;
    player.play()?.catch(() => {});
  }

  const activeIndex = segments.findIndex(
    (seg) => currentTime >= seg.start && currentTime < seg.end,
  );

  // Keep the active line centred inside the transcript list
  useEffect(() => {
    const list = listRef.current;
    const activeItem = list?.querySelector(".is-active");
    if (!list || !activeItem) return;

    const top =
      activeItem.offsetTop -
      list.clientHeight / 2 +
      activeItem.clientHeight / 2;
    list.scrollTo({ top, behavior: "smooth" });
  }, [activeIndex, activeTab]);

  // Keep the newest chat message in view. A new AI reply scrolls to its
  // first line so long answers are read from the top.
  useEffect(() => {
    const log = chatLogRef.current;
    if (!log) return;

    const last = messages[messages.length - 1];
    if (last?.role === "assistant" && !isReplying) {
      const items = log.querySelectorAll(".chat-message");
      const el = items[items.length - 1];
      if (el) {
        log.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
        return;
      }
    }
    log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
  }, [messages, isReplying, activeTab]);

  // Keep hooks above these conditional returns
  if (videoError) {
    return (
      <div className="watch-page">
        <p className="watch-status watch-status-error" role="alert">
          {videoError}
        </p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="watch-page">
        <p className="watch-status" role="status">
          Loading video…
        </p>
      </div>
    );
  }

  const transcriptReady = transcriptionStatus === "completed";
  const transcriptWorking =
    isTranscribing || transcriptionStatus === "processing";
  const summaryReady = Boolean(summary);
  const summaryWorking = isSummarizing;

  const tabs = [
    { key: "transcript", label: "Transcript" },
    { key: "summary", label: "Summary" },
    { key: "chat", label: "Chat" },
  ];

  // ---------- Panel content ----------

  function renderTranscript() {
    if (transcriptReady) {
      if (segments.length === 0) {
        return (
          <div className="panel-empty">
            <p className="empty-title">No speech found</p>
            <p className="empty-body">
              This video doesn't seem to contain any spoken words.
            </p>
          </div>
        );
      }
      return (
        <ul className="transcript-list" ref={listRef}>
          {segments.map((seg, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => seekTo(seg.start)}
                className={`segment ${index === activeIndex ? "is-active" : ""}`}
                aria-current={index === activeIndex ? "true" : undefined}
              >
                <span className="time-real">{formatTiming(seg.start)}</span>
                <span className="segment-text">{seg.text}</span>
              </button>
            </li>
          ))}
        </ul>
      );
    }

    if (transcriptWorking) {
      return (
        <div className="panel-empty" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          <p className="empty-title">Transcribing this lecture</p>
          <p className="empty-body">
            This can take a few minutes. The transcript appears here when it's
            ready.
          </p>
        </div>
      );
    }

    const failed = transcriptionStatus === "failed";
    return (
      <div className="panel-empty">
        <p className="empty-title">
          {failed ? "Transcription failed" : "No transcript yet"}
        </p>
        <p className="empty-body">
          {failed
            ? "Something went wrong while transcribing. Try again."
            : "Generate one to read along and jump to any moment in the video."}
        </p>
        <button
          type="button"
          className="btn btn-chalk"
          onClick={handleTranscribe}
        >
          {failed ? "Retry transcription" : "Generate transcript"}
        </button>
        {transcriptionError && (
          <p className="panel-error" role="alert">
            {transcriptionError}
          </p>
        )}
      </div>
    );
  }

  function renderSummary() {
    if (summaryReady) {
      return (
        <div className="summary-body">
          <p className="summary-text">{summary}</p>
        </div>
      );
    }

    if (summaryWorking) {
      return (
        <div className="panel-empty" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          <p className="empty-title">Writing the summary</p>
          <p className="empty-body">
            This usually takes under a minute. It appears here when it's ready.
          </p>
        </div>
      );
    }

    // The summary is built from the transcript, so that comes first
    if (!transcriptReady) {
      return (
        <div className="panel-empty">
          <p className="empty-title">Transcript needed first</p>
          <p className="empty-body">
            The summary is built from the transcript. Generate the transcript,
            then come back here.
          </p>
          <button
            type="button"
            className="btn btn-chalk"
            onClick={() => setActiveTab("transcript")}
          >
            Go to transcript
          </button>
        </div>
      );
    }

    const failed = Boolean(summaryError);
    return (
      <div className="panel-empty">
        <p className="empty-title">
          {failed ? "Summary failed" : "No summary yet"}
        </p>
        <p className="empty-body">
          {failed
            ? "The summary couldn't be written. Try again."
            : "Get the key points of this lecture without watching it all."}
        </p>
        <button
          type="button"
          className="btn btn-chalk"
          onClick={handleSummarize}
        >
          {failed ? "Retry summary" : "Generate summary"}
        </button>
        {summaryError && (
          <p className="panel-error" role="alert">
            {summaryError}
          </p>
        )}
      </div>
    );
  }

  function renderChat() {
    // The AI answers from the lecture, so it needs a transcript or summary
    if (!transcriptReady && !summaryReady) {
      return (
        <div className="panel-empty">
          <p className="empty-title">Transcript needed first</p>
          <p className="empty-body">
            The AI answers from what's said in the video. Generate the
            transcript, then ask your questions here.
          </p>
          <button
            type="button"
            className="btn btn-chalk"
            onClick={() => setActiveTab("transcript")}
          >
            Go to transcript
          </button>
        </div>
      );
    }

    return (
      <div className="chat">
        <div className="chat-log" ref={chatLogRef}>
          {messages.length === 0 && (
            <div className="chat-intro">
              <p className="empty-title">Ask about this lecture</p>
              <p className="empty-body">
                Answers come from what's said in the video.
              </p>
              <div className="chat-suggestions">
                {CHAT_SUGGESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    className="chat-chip"
                    onClick={() => sendMessage(question)}
                    disabled={isReplying}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.role}`}>
              {message.content}
            </div>
          ))}

          {isReplying && (
            <p className="chat-thinking" role="status">
              Thinking…
            </p>
          )}
        </div>

        {chatError && (
          <p className="panel-error chat-error" role="alert">
            {chatError}
          </p>
        )}

        <form
          className="chat-form"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(chatInput);
          }}
        >
          <textarea
            className="chat-input"
            rows={1}
            value={chatInput}
            placeholder="Ask a question…"
            aria-label="Ask a question about this video"
            onChange={(event) => setChatInput(event.target.value)}
            onKeyDown={(event) => {
              // Enter sends, Shift+Enter adds a new line
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage(chatInput);
              }
            }}
          />
          <button
            type="submit"
            className="btn btn-chalk"
            disabled={isReplying || !chatInput.trim()}
          >
            Send
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="watch-page">
      <div className={`watch-layout ${showPanel ? "" : "panel-hidden"}`}>
        <main className="watch-main">
          <div className="player-frame">
            <video
              controls
              ref={videoRef}
              className="video-main"
              onTimeUpdate={(event) =>
                setCurrentTime(event.currentTarget.currentTime)
              }
            >
              <source src={video.videoUrl} type="video/mp4" />
            </video>
          </div>

          <div className="video-info">
            <h1 className="video-title">{video.title}</h1>
            <p className="video-meta">
              Uploaded {new Date(video.createdAt).toLocaleDateString()}
            </p>
            {video.description && (
              <p className="video-description">{video.description}</p>
            )}
          </div>

          <div className="video-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/edit/${id}`)}
            >
              Edit video
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowPanel((previous) => !previous)}
            >
              {showPanel ? "Hide panel" : "Show panel"}
            </button>
          </div>
        </main>

        {showPanel && (
          <aside className="side-panel">
            <div
              className="panel-tabs"
              role="tablist"
              aria-label="Lecture tools"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  id={`tab-${tab.key}`}
                  aria-selected={activeTab === tab.key}
                  aria-controls={`panel-${tab.key}`}
                  className={`panel-tab ${activeTab === tab.key ? "is-selected" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div
              className="panel-content"
              role="tabpanel"
              id={`panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
            >
              {activeTab === "transcript" && renderTranscript()}
              {activeTab === "summary" && renderSummary()}
              {activeTab === "chat" && renderChat()}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
