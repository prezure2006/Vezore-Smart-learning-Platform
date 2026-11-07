import { NavLink } from "react-router-dom";
import "./sidebar.css";

const SideBar = () => {
  return (
    <aside className="sidebar">
      <div>
        <div className="heading-menu">
          <h1>Menu</h1>
        </div>
        <div className="listf">
          <NavLink to="/" end>
            <span className="link-text">Home</span>
          </NavLink>
          <NavLink to="/learnings">
            <span className="link-text">My Learnings</span>
          </NavLink>
          <NavLink to="/history">
            <span className="link-text">Watch History</span>
          </NavLink>
          <NavLink to="/saved">
            <span className="link-text">Saved Videos</span>
          </NavLink>
        </div>
      </div>

      <div className="ai-section">
        <div className="heading-menu">
          <h1>AI Tools</h1>
        </div>
        <div className="listf">
          <NavLink to="/summaries">
            <span className="link-text">My Summaries</span>
          </NavLink>
          <NavLink to="/transcripts">
            <span className="link-text">Transcripts</span>
          </NavLink>
          <NavLink to="/quizzes">
            <span className="link-text">Quizzes</span>
            <span className="badge-new">NEW</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
