import "./mainl.css";
import Navbar from "../components/navbar/Navbar";
import SideBar from "../components/sidebar/SideBar";
import VideoGrid from "../components/videogrid/VideoGrid";

const MainLayout = () => {
  return (
    <div className="layout">
      <h1>Intelligent Video Platform</h1>
      <Navbar />

      <div className="dashboard">
        <SideBar />
        <main className="main-content">
          <VideoGrid />
        </main>
      </div>
    </div>
  );
};
export default MainLayout;
