import MainLayout from "./layouts/MainLayout";

import { Routes, Route } from "react-router-dom";
import WatchPage from "./pages/watchpage/WatchPage";
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
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/watch/:id" element={<WatchPage />} />
    </Routes>
  );
}

export default App;
