import "./sidebar.css";
const SideBar = () => {
  return (
    <aside className="sidebar">
      <div className="heading-menu">
        <h1>Menu</h1>
      </div>
      <div className="listf">
        <a href="#">Home</a>
        <a href="#">My Learnings</a>
        <a href="#">Watch History</a>

        <a href="#">Saved Videos</a>
      </div>
    </aside>
  );
};
export default SideBar;
