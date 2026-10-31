import { useEffect, useState } from "react";
import Navbar from "./components/navbar/Navbar";
import MainLayout from "./layouts/MainLayout";
import VideoCard from "./components/videocard/VideoCard";
import VideoGrid from "./components/videogrid/VideoGrid";

function App() {
  // const [message, setMessage] = useState("Connecting...");
  // const [error, setError] = useState("");

  // useEffect(() => {
  //   fetch(`${import.meta.env.VITE_API_URL}/api/health`)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("API request failed");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setMessage(data.message);
  //     })
  //     .catch((err) => {
  //       setError(err.message);
  //     });
  // }, []);

  return (
    <div>
      <h1>Intelligent Video Platform</h1>

      <MainLayout />
    </div>
  );
}

export default App;
