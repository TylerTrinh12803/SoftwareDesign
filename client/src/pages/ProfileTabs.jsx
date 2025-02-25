import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import History from "./History";
import Profile from "./Profile";
import Users from "./Users"; // Import Users.jsx
import "../style/ProfileTabs.css";

function ProfileTabs() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  return (
    <div className={`profile-tabs-container ${activeTab === "users" ? "users-background" : ""}`}>
      {/* Unified Content Wrapper */}
      <div className="content-wrapper">
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="home-button" onClick={() => navigate("/")}>
              <div className="home-logo"></div>
              <span>Home</span>
            </div>
          </div>

          <div className="sidebar-menu">
            <div
              className={`menu-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile Management
            </div>
            <div
              className={`menu-item ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              Volunteer History
            </div>

            {/* Admin-Only Users Tab */}
            {isAdmin && (
              <div
                className={`menu-item ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("users")}
              >
                Manage Users
              </div>
            )}
          </div>
        </div>

        {/* Content Area Inside Same Box */}
        <div className="tab-content">
          <div className="content-box">
            {activeTab === "profile" && <Profile />}
            {activeTab === "history" && <History />}
            {activeTab === "users" && isAdmin && <Users />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileTabs;
