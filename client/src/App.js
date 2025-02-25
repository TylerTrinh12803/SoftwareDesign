import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Update from "./pages/Update";
import Notification from "./pages/Notification";
import History from "./pages/History";
import ProfileTabs from "./pages/ProfileTabs";
import Users from "./pages/Users";
import MatchingAdd from "./pages/MatchingAdd";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/update" element={<Update />} />
        <Route path="/Notification" element={<Notification />}/>
        <Route path="/History" element={<History />}/>
        <Route path="/profile" element={<ProfileTabs />}/>
        <Route path="/eventandmatch" element={<MatchingAdd />}/>
        <Route path="/Users" element={<Users />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
