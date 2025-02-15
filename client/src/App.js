import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Update from "./pages/Update";
import Notification from "./pages/Notification";
import History from "./pages/History";
import ProfileTabs from "./pages/ProfileTabs";
import MatchingAdd from "./pages/MatchingAdd";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/update" element={<Update />} />
        <Route path="/Notification" element={<Notification />}/>
        <Route path="/History" element={<History />}/>
        <Route path="/profile" element={<ProfileTabs />}/>
        <Route path="/eventandmatch" element={<MatchingAdd />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
