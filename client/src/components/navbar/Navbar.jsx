import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="container">
      <h1 className="comp-name" onClick={() => navigate("/")}>
        Vezore.com
      </h1>

      <div className="search-box">
        <svg
          className="search-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="inpt"
          id="searchf"
          placeholder="Search videos, topics, summaries..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="nav-actions">
        <button className="upload-btn" onClick={() => navigate("/upload")}>
          <span>＋</span>
          <span className="upload-text">Upload</span>
        </button>

        <button
          className="icon-btn"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          title="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <button className="icon-btn notif-btn" title="Notifications">
          🔔
          <span className="notif-dot"></span>
        </button>

        <img
          src="https://i.pinimg.com/736x/76/01/f5/7601f57a17473be024d6638225cd2d90.jpg"
          alt="Profile"
          className="pfp-img"
          onClick={() => navigate("/profile")}
        />
      </div>
    </div>
  );
};

export default Navbar;
