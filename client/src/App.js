import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Add from "./pages/Add";
import Update from "./pages/Update";
import VolunteerMatchingForm from "./pages/VolunteerMatchingForm";
import Notification from "./pages/Notification";
import History from "./pages/History";
import ProfileTabs from "./pages/ProfileTabs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add" element={<Add />} />
        <Route path="/update" element={<Update />} />
        <Route path="/Volunteer-Matching-Form" element={<VolunteerMatchingForm />}/>
        <Route path="/Notification" element={<Notification />}/>
        <Route path="/History" element={<History />}/>
        <Route path="/profile" element={<ProfileTabs />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
