import MainLayout from "./layouts/MainLayout";

import { Routes, Route } from "react-router-dom";
import WatchPage from "./pages/watchpage/WatchPage";
import Upload from "./pages/upload/Upload";
import EditPage from "./pages/editpage/EditPage";
import Profile from "./pages/profile/Profile";
import SignUp from "./pages/authpages/SignUp";
import SignIn from "./pages/authpages/SignIn";
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/watch/:id" element={<WatchPage />} />
      <Route path="/upload" element={<Upload />}></Route>
      <Route path="/edit/:id" element={<EditPage />}></Route>
      <Route path="/profile" element={<Profile />}></Route>
      <Route path="/signin" element={<SignIn />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>
    </Routes>
  );
}

export default App;
